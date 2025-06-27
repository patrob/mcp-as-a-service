import { DockerManager, ContainerConfig } from './docker';

export interface ServerTemplate {
  dockerImage: string;
  environmentVariables: Record<string, string>;
  exposedPorts: Array<{ container: number; protocol: string }>;
}

export interface ContainerCreationResult {
  containerId: string;
  hostPort: number;
}

/**
 * Orchestrates Docker container operations for MCP servers.
 * Handles container lifecycle and configuration management.
 */
export class DockerOrchestrator {
  private docker: DockerManager;

  constructor() {
    this.docker = new DockerManager();
  }

  /**
   * Initialize the Docker orchestrator and ensure required networks exist
   */
  async initialize(): Promise<void> {
    await this.docker.ensureNetwork();
  }

  /**
   * Create and start a new server container
   */
  async createServerContainer(
    serverName: string,
    template: ServerTemplate,
    config: Record<string, any>
  ): Promise<ContainerCreationResult> {
    const hostPort = await this.docker.findAvailablePort();
    
    // Merge template environment variables with user config
    // User config takes precedence over template defaults
    const environment = {
      ...template.environmentVariables,
      ...config
    };

    // Map exposed ports to host ports
    const portMappings = template.exposedPorts.map(port => ({
      hostPort,
      containerPort: port.container,
      protocol: port.protocol
    }));

    const containerConfig: ContainerConfig = {
      image: template.dockerImage,
      name: `mcp-${serverName}`,
      environment,
      portMappings,
      labels: { 'mcp-service': 'true' },
      networks: ['mcp-network']
    };

    const containerId = await this.docker.createContainer(containerConfig);
    await this.docker.startContainer(containerId);

    return { containerId, hostPort };
  }

  /**
   * Start an existing container
   */
  async startContainer(containerId: string): Promise<void> {
    await this.docker.startContainer(containerId);
  }

  /**
   * Stop a running container
   */
  async stopContainer(containerId: string): Promise<void> {
    await this.docker.stopContainer(containerId);
  }

  /**
   * Remove a container completely (stops first if running)
   */
  async removeContainer(containerId: string): Promise<void> {
    try {
      await this.docker.stopContainer(containerId);
    } catch (error) {
      // Container might already be stopped, continue with removal
    }
    await this.docker.removeContainer(containerId);
  }

  /**
   * Get current status of a container
   */
  async getContainerStatus(containerId: string): Promise<any> {
    return await this.docker.getContainerInfo(containerId);
  }

  /**
   * List all managed MCP containers
   */
  async listManagedContainers(): Promise<any[]> {
    return await this.docker.listManagedContainers();
  }
}