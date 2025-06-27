import { DockerManager, ContainerConfig } from './docker';
import { DatabaseManager } from './database';
import { DockerOrchestrator } from './docker-orchestrator';

export interface ServerTemplate {
  id: number;
  name: string;
  description: string;
  dockerImage: string;
  environmentVariables: Record<string, string>;
  exposedPorts: Array<{ container: number; protocol: string }>;
  requiredConfig: Record<string, any>;
  isBuiltin: boolean;
  isPublic: boolean;
}

export interface ServerInstance {
  id: number;
  userId: number;
  templateId: number;
  name: string;
  containerId: string | null;
  status: 'stopped' | 'starting' | 'running' | 'error';
  port: number | null;
  config: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  template?: ServerTemplate;
}

export class MCPServerManager {
  private docker: DockerManager;
  private dockerOrchestrator: DockerOrchestrator;
  private db: DatabaseManager;

  constructor() {
    this.docker = new DockerManager();
    this.dockerOrchestrator = new DockerOrchestrator();
    this.db = new DatabaseManager();
  }

  async initialize(): Promise<void> {
    await this.dockerOrchestrator.initialize();
  }

  async getAvailableTemplates(): Promise<ServerTemplate[]> {
    return await this.db.query(`
      SELECT 
        id, name, description, docker_image as "dockerImage",
        environment_variables as "environmentVariables",
        exposed_ports as "exposedPorts",
        required_config as "requiredConfig",
        is_builtin as "isBuiltin",
        is_public as "isPublic"
      FROM server_templates 
      WHERE is_public = TRUE OR is_builtin = TRUE
      ORDER BY is_builtin DESC, name ASC
    `);
  }

  async getUserServerInstances(userId: number): Promise<ServerInstance[]> {
    const instances = await this.db.query(`
      SELECT 
        si.id, si.user_id as "userId", si.template_id as "templateId",
        si.name, si.container_id as "containerId", si.status,
        si.port, si.config, si.created_at as "createdAt",
        si.updated_at as "updatedAt",
        st.name as "templateName", st.description as "templateDescription"
      FROM server_instances si
      JOIN server_templates st ON si.template_id = st.id
      WHERE si.user_id = $1
      ORDER BY si.created_at DESC
    `, [userId]);

    return instances;
  }

  async createServerInstance(
    userId: number, 
    templateId: number, 
    name: string, 
    config: Record<string, any>
  ): Promise<ServerInstance> {
    const template = await this.db.query(`
      SELECT * FROM server_templates WHERE id = $1
    `, [templateId]);

    if (!template.length) {
      throw new Error('Template not found');
    }

    const serverTemplate = template[0];

    // Validate required config
    const requiredConfig = serverTemplate.required_config || {};
    for (const [key, requirements] of Object.entries(requiredConfig)) {
      if ((requirements as any)?.required && !config[key]) {
        throw new Error(`Missing required configuration: ${key}`);
      }
    }

    // Check if user already has a server with this name
    const existing = await this.db.query(`
      SELECT id FROM server_instances 
      WHERE user_id = $1 AND name = $2
    `, [userId, name]);

    if (existing.length > 0) {
      throw new Error('Server name already exists');
    }

    // Create database record
    const [instance] = await this.db.query(`
      INSERT INTO server_instances (user_id, template_id, name, config, status)
      VALUES ($1, $2, $3, $4, 'stopped')
      RETURNING *
    `, [userId, templateId, name, JSON.stringify(config)]);

    return {
      ...instance,
      userId: instance.user_id,
      templateId: instance.template_id,
      containerId: instance.container_id,
      createdAt: instance.created_at,
      updatedAt: instance.updated_at
    };
  }

  async startServerInstance(instanceId: number, userId: number): Promise<void> {
    const instance = await this.getServerInstance(instanceId, userId);
    if (!instance) {
      throw new Error('Server instance not found');
    }

    if (instance.status === 'running') {
      return; // Already running
    }

    try {
      await this.updateInstanceStatus(instanceId, 'starting');

      const template = await this.db.query(`
        SELECT * FROM server_templates WHERE id = $1
      `, [instance.templateId]);

      if (!template.length) {
        throw new Error('Template not found');
      }

      const serverTemplate = template[0];
      
      // Convert database template to orchestrator template format
      const orchestratorTemplate = {
        dockerImage: serverTemplate.docker_image,
        environmentVariables: serverTemplate.environment_variables || {},
        exposedPorts: serverTemplate.exposed_ports || []
      };

      // Add MCP_SERVER_PORT to config
      const config = {
        ...instance.config
      };

      const { containerId, hostPort } = await this.dockerOrchestrator.createServerContainer(
        `${instance.name}-${instanceId}`,
        orchestratorTemplate,
        config
      );

      // Update database
      await this.db.query(`
        UPDATE server_instances 
        SET container_id = $1, port = $2, status = 'running', updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
      `, [containerId, hostPort, instanceId]);

    } catch (error) {
      await this.updateInstanceStatus(instanceId, 'error');
      throw error;
    }
  }

  async stopServerInstance(instanceId: number, userId: number): Promise<void> {
    const instance = await this.getServerInstance(instanceId, userId);
    if (!instance || !instance.containerId) {
      throw new Error('Server instance not found or not running');
    }

    try {
      await this.dockerOrchestrator.stopContainer(instance.containerId);
      await this.updateInstanceStatus(instanceId, 'stopped');
    } catch (error) {
      await this.updateInstanceStatus(instanceId, 'error');
      throw error;
    }
  }

  async deleteServerInstance(instanceId: number, userId: number): Promise<void> {
    const instance = await this.getServerInstance(instanceId, userId);
    if (!instance) {
      throw new Error('Server instance not found');
    }

    try {
      // Stop and remove container if it exists
      if (instance.containerId) {
        await this.dockerOrchestrator.removeContainer(instance.containerId);
      }

      // Remove from database
      await this.db.query(`
        DELETE FROM server_instances WHERE id = $1
      `, [instanceId]);
    } catch (error) {
      console.error('Error deleting server instance:', error);
      throw error;
    }
  }

  async getServerInstance(instanceId: number, userId: number): Promise<ServerInstance | null> {
    const [instance] = await this.db.query(`
      SELECT 
        si.id, si.user_id as "userId", si.template_id as "templateId",
        si.name, si.container_id as "containerId", si.status,
        si.port, si.config, si.created_at as "createdAt",
        si.updated_at as "updatedAt"
      FROM server_instances si
      WHERE si.id = $1 AND si.user_id = $2
    `, [instanceId, userId]);

    return instance || null;
  }

  async getServerLogs(instanceId: number, userId: number): Promise<string> {
    const instance = await this.getServerInstance(instanceId, userId);
    if (!instance || !instance.containerId) {
      throw new Error('Server instance not found or not running');
    }

    return await this.docker.getContainerLogs(instance.containerId);
  }

  async syncContainerStatuses(): Promise<void> {
    const instances = await this.db.query(`
      SELECT id, container_id, status 
      FROM server_instances 
      WHERE container_id IS NOT NULL
    `);

    for (const instance of instances) {
      try {
        const containerInfo = await this.dockerOrchestrator.getContainerStatus(instance.container_id);
        
        let newStatus = 'error';
        if (containerInfo) {
          switch (containerInfo.status) {
            case 'running':
              newStatus = 'running';
              break;
            case 'exited':
            case 'stopped':
              newStatus = 'stopped';
              break;
            default:
              newStatus = 'error';
          }
        }

        if (newStatus !== instance.status) {
          await this.updateInstanceStatus(instance.id, newStatus);
        }
      } catch (error) {
        console.error(`Error syncing container ${instance.container_id}:`, error);
      }
    }
  }

  private async updateInstanceStatus(instanceId: number, status: string): Promise<void> {
    await this.db.query(`
      UPDATE server_instances 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [status, instanceId]);
  }
}