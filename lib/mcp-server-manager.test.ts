import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MCPServerManager } from './mcp-server-manager';

// Mock dependencies
const mockDockerManager = {
  ensureNetwork: vi.fn(),
  createContainer: vi.fn(),
  startContainer: vi.fn(),
  stopContainer: vi.fn(),
  removeContainer: vi.fn(),
  getContainerInfo: vi.fn(),
  findAvailablePort: vi.fn(),
  getContainerLogs: vi.fn(),
};

const mockDockerOrchestrator = {
  initialize: vi.fn(),
  createServerContainer: vi.fn(),
  startContainer: vi.fn(),
  stopContainer: vi.fn(),
  removeContainer: vi.fn(),
  getContainerStatus: vi.fn(),
  listManagedContainers: vi.fn(),
};

const mockDatabaseManager = {
  query: vi.fn(),
};

vi.mock('./docker', () => ({
  DockerManager: vi.fn(() => mockDockerManager),
}));

vi.mock('./docker-orchestrator', () => ({
  DockerOrchestrator: vi.fn(() => mockDockerOrchestrator),
}));

vi.mock('./database', () => ({
  DatabaseManager: vi.fn(() => mockDatabaseManager),
}));

describe('MCPServerManager', () => {
  let manager: MCPServerManager;

  beforeEach(() => {
    manager = new MCPServerManager();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialize', () => {
    it('should ensure Docker network exists', async () => {
      await manager.initialize();
      expect(mockDockerOrchestrator.initialize).toHaveBeenCalled();
    });
  });

  describe('getAvailableTemplates', () => {
    it('should return public and builtin templates', async () => {
      const mockTemplates = [
        {
          id: 1,
          name: 'GitHub MCP Server',
          description: 'GitHub integration',
          dockerImage: 'mcp-github-server:latest',
          environmentVariables: { NODE_ENV: 'production' },
          exposedPorts: [{ container: 3000, protocol: 'tcp' }],
          requiredConfig: { github_token: { type: 'string', required: true } },
          isBuiltin: true,
          isPublic: true,
        },
      ];

      mockDatabaseManager.query.mockResolvedValue(mockTemplates);

      const result = await manager.getAvailableTemplates();

      expect(mockDatabaseManager.query).toHaveBeenCalledWith(
        expect.stringContaining('FROM server_templates')
      );
      expect(result).toEqual(mockTemplates);
    });
  });

  describe('getUserServerInstances', () => {
    it('should return user server instances with template info', async () => {
      const mockInstances = [
        {
          id: 1,
          userId: 123,
          templateId: 1,
          name: 'my-github-server',
          containerId: 'container123',
          status: 'running',
          port: 3000,
          config: { github_token: 'token123' },
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
          templateName: 'GitHub MCP Server',
          templateDescription: 'GitHub integration',
        },
      ];

      mockDatabaseManager.query.mockResolvedValue(mockInstances);

      const result = await manager.getUserServerInstances(123);

      expect(mockDatabaseManager.query).toHaveBeenCalledWith(
        expect.stringContaining('FROM server_instances si'),
        [123]
      );
      expect(result).toEqual(mockInstances);
    });
  });

  describe('createServerInstance', () => {
    it('should create server instance with valid config', async () => {
      const mockTemplate = {
        id: 1,
        name: 'GitHub MCP Server',
        docker_image: 'mcp-github-server:latest',
        required_config: {
          github_token: { type: 'string', required: true },
        },
      };

      const mockInstance = {
        id: 1,
        user_id: 123,
        template_id: 1,
        name: 'my-github-server',
        container_id: null,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      };

      mockDatabaseManager.query
        .mockResolvedValueOnce([mockTemplate]) // Template query
        .mockResolvedValueOnce([]) // Check existing name
        .mockResolvedValueOnce([mockInstance]); // Insert query

      const result = await manager.createServerInstance(
        123,
        1,
        'my-github-server',
        { github_token: 'token123' }
      );

      expect(result).toEqual({
        ...mockInstance,
        userId: 123,
        templateId: 1,
        containerId: null,
        createdAt: mockInstance.created_at,
        updatedAt: mockInstance.updated_at,
      });
    });

    it('should throw error if template not found', async () => {
      mockDatabaseManager.query.mockResolvedValue([]);

      await expect(
        manager.createServerInstance(123, 999, 'test-server', {})
      ).rejects.toThrow('Template not found');
    });

    it('should throw error if required config is missing', async () => {
      const mockTemplate = {
        id: 1,
        required_config: {
          github_token: { type: 'string', required: true },
        },
      };

      mockDatabaseManager.query.mockResolvedValue([mockTemplate]);

      await expect(
        manager.createServerInstance(123, 1, 'test-server', {})
      ).rejects.toThrow('Missing required configuration: github_token');
    });

    it('should throw error if server name already exists', async () => {
      const mockTemplate = {
        id: 1,
        required_config: {},
      };

      mockDatabaseManager.query
        .mockResolvedValueOnce([mockTemplate]) // Template query
        .mockResolvedValueOnce([{ id: 1 }]); // Existing name check

      await expect(
        manager.createServerInstance(123, 1, 'existing-server', {})
      ).rejects.toThrow('Server name already exists');
    });
  });

  describe('startServerInstance', () => {
    it('should start server instance successfully', async () => {
      const mockInstance = {
        id: 1,
        templateId: 1,
        name: 'test-server',
        config: { github_token: 'token123' },
        status: 'stopped',
      };

      const mockTemplate = {
        id: 1,
        docker_image: 'mcp-github-server:latest',
        environment_variables: { NODE_ENV: 'production' },
        exposed_ports: [{ container: 3000, protocol: 'tcp' }],
      };

      mockDatabaseManager.query
        .mockResolvedValueOnce(undefined) // Update status to starting
        .mockResolvedValueOnce([mockTemplate]) // Get template
        .mockResolvedValueOnce(undefined); // Update with container info

      mockDockerOrchestrator.createServerContainer.mockResolvedValue({
        containerId: 'container123',
        hostPort: 3001
      });

      // Mock getServerInstance method
      vi.spyOn(manager, 'getServerInstance').mockResolvedValue(mockInstance as any);

      await manager.startServerInstance(1, 123);

      expect(mockDockerOrchestrator.createServerContainer).toHaveBeenCalledWith(
        'test-server-1',
        {
          dockerImage: 'mcp-github-server:latest',
          environmentVariables: { NODE_ENV: 'production' },
          exposedPorts: [{ container: 3000, protocol: 'tcp' }],
        },
        { github_token: 'token123' }
      );
    });

    it('should not start if already running', async () => {
      const mockInstance = {
        status: 'running',
      };

      vi.spyOn(manager, 'getServerInstance').mockResolvedValue(mockInstance as any);

      await manager.startServerInstance(1, 123);

      expect(mockDockerOrchestrator.createServerContainer).not.toHaveBeenCalled();
    });

    it('should handle start errors and update status', async () => {
      const mockInstance = {
        id: 1,
        templateId: 1,
        name: 'test-server',
        config: {},
        status: 'stopped',
      };

      const mockTemplate = {
        id: 1,
        docker_image: 'mcp-github-server:latest',
        environment_variables: { NODE_ENV: 'production' },
        exposed_ports: [{ container: 3000, protocol: 'tcp' }],
      };

      vi.spyOn(manager, 'getServerInstance').mockResolvedValue(mockInstance as any);
      mockDatabaseManager.query
        .mockResolvedValueOnce(undefined) // Update status to starting
        .mockResolvedValueOnce([mockTemplate]) // Get template
        .mockResolvedValueOnce(undefined); // Update status to error
      
      mockDockerOrchestrator.createServerContainer.mockRejectedValue(new Error('Docker error'));

      await expect(manager.startServerInstance(1, 123)).rejects.toThrow('Docker error');
    });
  });

  describe('stopServerInstance', () => {
    it('should stop running server instance', async () => {
      const mockInstance = {
        id: 1,
        containerId: 'container123',
      };

      vi.spyOn(manager, 'getServerInstance').mockResolvedValue(mockInstance as any);

      await manager.stopServerInstance(1, 123);

      expect(mockDockerOrchestrator.stopContainer).toHaveBeenCalledWith('container123');
    });

    it('should throw error if instance not found', async () => {
      vi.spyOn(manager, 'getServerInstance').mockResolvedValue(null);

      await expect(manager.stopServerInstance(1, 123)).rejects.toThrow(
        'Server instance not found or not running'
      );
    });
  });

  describe('deleteServerInstance', () => {
    it('should delete server instance and container', async () => {
      const mockInstance = {
        id: 1,
        containerId: 'container123',
      };

      vi.spyOn(manager, 'getServerInstance').mockResolvedValue(mockInstance as any);

      await manager.deleteServerInstance(1, 123);

      expect(mockDockerOrchestrator.removeContainer).toHaveBeenCalledWith('container123');
      expect(mockDatabaseManager.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM server_instances WHERE id = $1'),
        [1]
      );
    });

    it('should handle deletion without container', async () => {
      const mockInstance = {
        id: 1,
        containerId: null,
      };

      vi.spyOn(manager, 'getServerInstance').mockResolvedValue(mockInstance as any);

      await manager.deleteServerInstance(1, 123);

      expect(mockDockerOrchestrator.removeContainer).not.toHaveBeenCalled();
      expect(mockDatabaseManager.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM server_instances WHERE id = $1'),
        [1]
      );
    });
  });

  describe('getServerLogs', () => {
    it('should return container logs', async () => {
      const mockInstance = {
        containerId: 'container123',
      };

      const mockLogs = 'Container log output';

      vi.spyOn(manager, 'getServerInstance').mockResolvedValue(mockInstance as any);
      mockDockerManager.getContainerLogs.mockResolvedValue(mockLogs);

      const result = await manager.getServerLogs(1, 123);

      expect(mockDockerManager.getContainerLogs).toHaveBeenCalledWith('container123');
      expect(result).toBe(mockLogs);
    });

    it('should throw error if instance not found', async () => {
      vi.spyOn(manager, 'getServerInstance').mockResolvedValue(null);

      await expect(manager.getServerLogs(1, 123)).rejects.toThrow(
        'Server instance not found or not running'
      );
    });
  });

  describe('syncContainerStatuses', () => {
    it('should sync container statuses from Docker', async () => {
      const mockInstances = [
        { id: 1, container_id: 'container123', status: 'running' },
        { id: 2, container_id: 'container456', status: 'stopped' },
      ];

      mockDatabaseManager.query.mockResolvedValue(mockInstances);
      mockDockerOrchestrator.getContainerStatus
        .mockResolvedValueOnce({ status: 'exited' })
        .mockResolvedValueOnce({ status: 'running' });

      await manager.syncContainerStatuses();

      // Should call initial query to get instances, then update calls for each status change
      expect(mockDatabaseManager.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT id, container_id, status')
      );
      expect(mockDatabaseManager.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE server_instances'),
        ['stopped', 1]
      );
    });

    it('should handle container info errors gracefully', async () => {
      const mockInstances = [
        { id: 1, container_id: 'container123', status: 'running' },
      ];

      mockDatabaseManager.query.mockResolvedValue(mockInstances);
      mockDockerOrchestrator.getContainerStatus.mockRejectedValue(new Error('Docker error'));

      // Should not throw
      await expect(manager.syncContainerStatuses()).resolves.toBeUndefined();
    });
  });
});