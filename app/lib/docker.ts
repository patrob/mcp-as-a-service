import Docker from 'dockerode';

export interface ContainerConfig {
  image: string;
  name: string;
  env: string[];
  ports: Record<string, any>;
  labels?: Record<string, string>;
}

export interface ContainerInfo {
  id: string;
  name: string;
  status: string;
  ports: Array<{
    host: number;
    container: number;
  }>;
  created: Date;
}

export class DockerManager {
  private docker: Docker;

  constructor() {
    this.docker = new Docker();
  }

  async createContainer(config: ContainerConfig): Promise<string> {
    try {
      const container = await this.docker.createContainer({
        Image: config.image,
        name: config.name,
        Env: config.env,
        ExposedPorts: Object.keys(config.ports).reduce((acc, port) => {
          acc[port] = {};
          return acc;
        }, {} as Record<string, any>),
        HostConfig: {
          PortBindings: config.ports,
          RestartPolicy: { Name: 'unless-stopped' },
          NetworkMode: 'mcp-network'
        },
        Labels: {
          'mcp.managed': 'true',
          'mcp.service': 'server',
          ...config.labels
        }
      });

      return container.id;
    } catch (error) {
      throw new Error(`Failed to create container: ${error}`);
    }
  }

  async startContainer(containerId: string): Promise<void> {
    try {
      const container = this.docker.getContainer(containerId);
      await container.start();
    } catch (error) {
      throw new Error(`Failed to start container: ${error}`);
    }
  }

  async stopContainer(containerId: string): Promise<void> {
    try {
      const container = this.docker.getContainer(containerId);
      await container.stop();
    } catch (error) {
      throw new Error(`Failed to stop container: ${error}`);
    }
  }

  async removeContainer(containerId: string, force = false): Promise<void> {
    try {
      const container = this.docker.getContainer(containerId);
      await container.remove({ force });
    } catch (error) {
      throw new Error(`Failed to remove container: ${error}`);
    }
  }

  async getContainerInfo(containerId: string): Promise<ContainerInfo | null> {
    try {
      const container = this.docker.getContainer(containerId);
      const info = await container.inspect();
      
      return {
        id: info.Id,
        name: info.Name.replace('/', ''),
        status: info.State.Status,
        ports: Object.entries(info.NetworkSettings.Ports || {})
          .filter(([_, hostPorts]) => hostPorts && hostPorts.length > 0)
          .map(([containerPort, hostPorts]) => ({
            container: parseInt(containerPort.split('/')[0]),
            host: parseInt((hostPorts as any)[0].HostPort)
          })),
        created: new Date(info.Created)
      };
    } catch (error) {
      console.error('Failed to get container info:', error);
      return null;
    }
  }

  async listManagedContainers(): Promise<ContainerInfo[]> {
    try {
      const containers = await this.docker.listContainers({
        all: true,
        filters: {
          label: ['mcp.managed=true']
        }
      });

      return containers.map(container => ({
        id: container.Id,
        name: container.Names[0].replace('/', ''),
        status: container.State,
        ports: container.Ports.map(port => ({
          container: port.PrivatePort,
          host: port.PublicPort || 0
        })),
        created: new Date(container.Created * 1000)
      }));
    } catch (error) {
      console.error('Failed to list containers:', error);
      return [];
    }
  }

  async getContainerLogs(containerId: string, tail = 100): Promise<string> {
    try {
      const container = this.docker.getContainer(containerId);
      const stream = await container.logs({
        stdout: true,
        stderr: true,
        tail,
        timestamps: true
      });
      return stream.toString();
    } catch (error) {
      console.error('Failed to get container logs:', error);
      return '';
    }
  }

  async findAvailablePort(startPort = 3000): Promise<number> {
    const containers = await this.listManagedContainers();
    const usedPorts = new Set(
      containers.flatMap(c => c.ports.map(p => p.host)).filter(p => p > 0)
    );

    let port = startPort;
    while (usedPorts.has(port)) {
      port++;
    }
    return port;
  }

  async ensureNetwork(): Promise<void> {
    try {
      const networks = await this.docker.listNetworks({
        filters: { name: ['mcp-network'] }
      });

      if (networks.length === 0) {
        await this.docker.createNetwork({
          Name: 'mcp-network',
          Driver: 'bridge',
          Labels: {
            'mcp.managed': 'true'
          }
        });
      }
    } catch (error) {
      console.error('Failed to ensure network:', error);
    }
  }
}