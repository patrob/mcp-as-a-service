import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DockerManager } from './docker';

// Mock dockerode
const mockContainer = {
  start: vi.fn(),
  stop: vi.fn(),
  remove: vi.fn(),
  inspect: vi.fn(),
  logs: vi.fn(),
};

const mockDocker = {
  createContainer: vi.fn(() => Promise.resolve(mockContainer)),
  getContainer: vi.fn(() => mockContainer),
  listContainers: vi.fn(),
  listNetworks: vi.fn(),
  createNetwork: vi.fn(),
};

vi.mock('dockerode', () => {
  return {
    default: vi.fn(() => mockDocker),
  };
});

describe('DockerManager', () => {
  let dockerManager: DockerManager;

  beforeEach(() => {
    dockerManager = new DockerManager();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createContainer', () => {
    it('should create container with correct configuration', async () => {
      mockContainer.id = 'container123';
      
      const config = {
        image: 'test-image:latest',
        name: 'test-container',
        env: ['NODE_ENV=production'],
        ports: { '3000/tcp': [{ HostPort: '8080' }] },
        labels: { 'test.label': 'value' },
      };

      const containerId = await dockerManager.createContainer(config);

      expect(mockDocker.createContainer).toHaveBeenCalledWith({
        Image: 'test-image:latest',
        name: 'test-container',
        Env: ['NODE_ENV=production'],
        ExposedPorts: { '3000/tcp': {} },
        HostConfig: {
          PortBindings: { '3000/tcp': [{ HostPort: '8080' }] },
          RestartPolicy: { Name: 'unless-stopped' },
          NetworkMode: 'mcp-network',
        },
        Labels: {
          'mcp.managed': 'true',
          'mcp.service': 'server',
          'test.label': 'value',
        },
      });
      expect(containerId).toBe('container123');
    });

    it('should throw error if container creation fails', async () => {
      mockDocker.createContainer.mockRejectedValue(new Error('Creation failed'));

      const config = {
        image: 'test-image:latest',
        name: 'test-container',
        env: [],
        ports: {},
      };

      await expect(dockerManager.createContainer(config)).rejects.toThrow('Failed to create container: Error: Creation failed');
    });
  });

  describe('startContainer', () => {
    it('should start container successfully', async () => {
      await dockerManager.startContainer('container123');

      expect(mockDocker.getContainer).toHaveBeenCalledWith('container123');
      expect(mockContainer.start).toHaveBeenCalled();
    });

    it('should throw error if start fails', async () => {
      mockContainer.start.mockRejectedValue(new Error('Start failed'));

      await expect(dockerManager.startContainer('container123')).rejects.toThrow('Failed to start container: Error: Start failed');
    });
  });

  describe('stopContainer', () => {
    it('should stop container successfully', async () => {
      await dockerManager.stopContainer('container123');

      expect(mockDocker.getContainer).toHaveBeenCalledWith('container123');
      expect(mockContainer.stop).toHaveBeenCalled();
    });

    it('should throw error if stop fails', async () => {
      mockContainer.stop.mockRejectedValue(new Error('Stop failed'));

      await expect(dockerManager.stopContainer('container123')).rejects.toThrow('Failed to stop container: Error: Stop failed');
    });
  });

  describe('removeContainer', () => {
    it('should remove container successfully', async () => {
      await dockerManager.removeContainer('container123');

      expect(mockDocker.getContainer).toHaveBeenCalledWith('container123');
      expect(mockContainer.remove).toHaveBeenCalledWith({ force: false });
    });

    it('should remove container with force option', async () => {
      await dockerManager.removeContainer('container123', true);

      expect(mockContainer.remove).toHaveBeenCalledWith({ force: true });
    });
  });

  describe('getContainerInfo', () => {
    it('should return container info successfully', async () => {
      const mockInspectResult = {
        Id: 'container123',
        Name: '/test-container',
        State: { Status: 'running' },
        Created: '2023-01-01T00:00:00Z',
        NetworkSettings: {
          Ports: {
            '3000/tcp': [{ HostPort: '8080' }],
            '8080/tcp': null,
          },
        },
      };

      mockContainer.inspect.mockResolvedValue(mockInspectResult);

      const info = await dockerManager.getContainerInfo('container123');

      expect(info).toEqual({
        id: 'container123',
        name: 'test-container',
        status: 'running',
        ports: [{ container: 3000, host: 8080 }],
        created: new Date('2023-01-01T00:00:00Z'),
      });
    });

    it('should return null if container inspection fails', async () => {
      mockContainer.inspect.mockRejectedValue(new Error('Not found'));

      const info = await dockerManager.getContainerInfo('container123');

      expect(info).toBeNull();
    });
  });

  describe('listManagedContainers', () => {
    it('should return list of managed containers', async () => {
      const mockContainers = [
        {
          Id: 'container123',
          Names: ['/test-container'],
          State: 'running',
          Created: 1672531200,
          Ports: [{ PrivatePort: 3000, PublicPort: 8080 }],
        },
      ];

      mockDocker.listContainers.mockResolvedValue(mockContainers);

      const containers = await dockerManager.listManagedContainers();

      expect(mockDocker.listContainers).toHaveBeenCalledWith({
        all: true,
        filters: { label: ['mcp.managed=true'] },
      });
      expect(containers).toEqual([
        {
          id: 'container123',
          name: 'test-container',
          status: 'running',
          ports: [{ container: 3000, host: 8080 }],
          created: new Date(1672531200 * 1000),
        },
      ]);
    });

    it('should return empty array on error', async () => {
      mockDocker.listContainers.mockRejectedValue(new Error('Docker error'));

      const containers = await dockerManager.listManagedContainers();

      expect(containers).toEqual([]);
    });
  });

  describe('findAvailablePort', () => {
    it('should return start port if no ports are used', async () => {
      mockDocker.listContainers.mockResolvedValue([]);

      const port = await dockerManager.findAvailablePort(3000);

      expect(port).toBe(3000);
    });

    it('should return next available port', async () => {
      const mockContainers = [
        {
          Id: 'container1',
          Names: ['/test1'],
          State: 'running',
          Created: 1672531200,
          Ports: [{ PrivatePort: 3000, PublicPort: 3000 }],
        },
        {
          Id: 'container2',
          Names: ['/test2'],
          State: 'running',
          Created: 1672531200,
          Ports: [{ PrivatePort: 3000, PublicPort: 3001 }],
        },
      ];

      mockDocker.listContainers.mockResolvedValue(mockContainers);

      const port = await dockerManager.findAvailablePort(3000);

      expect(port).toBe(3002);
    });
  });

  describe('ensureNetwork', () => {
    it('should create network if it does not exist', async () => {
      mockDocker.listNetworks.mockResolvedValue([]);

      await dockerManager.ensureNetwork();

      expect(mockDocker.listNetworks).toHaveBeenCalledWith({
        filters: { name: ['mcp-network'] },
      });
      expect(mockDocker.createNetwork).toHaveBeenCalledWith({
        Name: 'mcp-network',
        Driver: 'bridge',
        Labels: { 'mcp.managed': 'true' },
      });
    });

    it('should not create network if it already exists', async () => {
      mockDocker.listNetworks.mockResolvedValue([{ Name: 'mcp-network' }]);

      await dockerManager.ensureNetwork();

      expect(mockDocker.createNetwork).not.toHaveBeenCalled();
    });
  });
});