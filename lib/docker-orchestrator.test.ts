import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DockerOrchestrator } from './docker-orchestrator';
import { DockerManager } from './docker';

// Mock DockerManager
vi.mock('./docker');

describe('DockerOrchestrator', () => {
  const mockDockerManager = {
    ensureNetwork: vi.fn(),
    findAvailablePort: vi.fn(),
    createContainer: vi.fn(),
    startContainer: vi.fn(),
    stopContainer: vi.fn(),
    removeContainer: vi.fn(),
    getContainerInfo: vi.fn(),
    listManagedContainers: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(DockerManager).mockImplementation(() => mockDockerManager as any);
  });

  describe('initialization', () => {
    it('should initialize docker network', async () => {
      // Arrange
      const orchestrator = new DockerOrchestrator();
      mockDockerManager.ensureNetwork.mockResolvedValue(undefined);

      // Act
      await orchestrator.initialize();

      // Assert
      expect(mockDockerManager.ensureNetwork).toHaveBeenCalled();
    });
  });

  describe('createServerContainer', () => {
    const mockTemplate = {
      dockerImage: 'test-image:latest',
      environmentVariables: { NODE_ENV: 'production' },
      exposedPorts: [{ container: 3000, protocol: 'tcp' }]
    };

    const mockConfig = { apiKey: 'test-key' };

    it('should create and start container successfully', async () => {
      // Arrange
      const orchestrator = new DockerOrchestrator();
      const hostPort = 8080;
      const containerId = 'container-123';

      mockDockerManager.findAvailablePort.mockResolvedValue(hostPort);
      mockDockerManager.createContainer.mockResolvedValue(containerId);
      mockDockerManager.startContainer.mockResolvedValue(undefined);

      // Act
      const result = await orchestrator.createServerContainer(
        'test-server',
        mockTemplate,
        mockConfig
      );

      // Assert
      expect(result).toEqual({ containerId, hostPort });
      expect(mockDockerManager.findAvailablePort).toHaveBeenCalled();
      expect(mockDockerManager.createContainer).toHaveBeenCalledWith({
        image: 'test-image:latest',
        name: 'mcp-test-server',
        environment: {
          NODE_ENV: 'production',
          ...mockConfig
        },
        portMappings: [{ hostPort, containerPort: 3000, protocol: 'tcp' }],
        labels: { 'mcp-service': 'true' },
        networks: ['mcp-network']
      });
      expect(mockDockerManager.startContainer).toHaveBeenCalledWith(containerId);
    });

    it('should handle multiple exposed ports', async () => {
      // Arrange
      const orchestrator = new DockerOrchestrator();
      const templateWithMultiplePorts = {
        ...mockTemplate,
        exposedPorts: [
          { container: 3000, protocol: 'tcp' },
          { container: 9090, protocol: 'tcp' }
        ]
      };

      mockDockerManager.findAvailablePort.mockResolvedValue(8080);
      mockDockerManager.createContainer.mockResolvedValue('container-123');
      mockDockerManager.startContainer.mockResolvedValue(undefined);

      // Act
      await orchestrator.createServerContainer(
        'test-server',
        templateWithMultiplePorts,
        mockConfig
      );

      // Assert
      expect(mockDockerManager.createContainer).toHaveBeenCalledWith({
        image: 'test-image:latest',
        name: 'mcp-test-server',
        environment: {
          NODE_ENV: 'production',
          ...mockConfig
        },
        portMappings: [
          { hostPort: 8080, containerPort: 3000, protocol: 'tcp' },
          { hostPort: 8080, containerPort: 9090, protocol: 'tcp' }
        ],
        labels: { 'mcp-service': 'true' },
        networks: ['mcp-network']
      });
    });

    it('should merge template environment with config', async () => {
      // Arrange
      const orchestrator = new DockerOrchestrator();
      const configWithEnvVar = { NODE_ENV: 'development', apiKey: 'test-key' };

      mockDockerManager.findAvailablePort.mockResolvedValue(8080);
      mockDockerManager.createContainer.mockResolvedValue('container-123');
      mockDockerManager.startContainer.mockResolvedValue(undefined);

      // Act
      await orchestrator.createServerContainer(
        'test-server',
        mockTemplate,
        configWithEnvVar
      );

      // Assert
      expect(mockDockerManager.createContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          environment: {
            NODE_ENV: 'development', // Config should override template
            apiKey: 'test-key'
          }
        })
      );
    });

    it('should propagate docker errors', async () => {
      // Arrange
      const orchestrator = new DockerOrchestrator();
      mockDockerManager.findAvailablePort.mockRejectedValue(new Error('No ports available'));

      // Act & Assert
      await expect(orchestrator.createServerContainer(
        'test-server',
        mockTemplate,
        mockConfig
      )).rejects.toThrow('No ports available');
    });
  });

  describe('startContainer', () => {
    it('should start existing container', async () => {
      // Arrange
      const orchestrator = new DockerOrchestrator();
      const containerId = 'container-123';
      mockDockerManager.startContainer.mockResolvedValue(undefined);

      // Act
      await orchestrator.startContainer(containerId);

      // Assert
      expect(mockDockerManager.startContainer).toHaveBeenCalledWith(containerId);
    });
  });

  describe('stopContainer', () => {
    it('should stop existing container', async () => {
      // Arrange
      const orchestrator = new DockerOrchestrator();
      const containerId = 'container-123';
      mockDockerManager.stopContainer.mockResolvedValue(undefined);

      // Act
      await orchestrator.stopContainer(containerId);

      // Assert
      expect(mockDockerManager.stopContainer).toHaveBeenCalledWith(containerId);
    });
  });

  describe('removeContainer', () => {
    it('should remove container completely', async () => {
      // Arrange
      const orchestrator = new DockerOrchestrator();
      const containerId = 'container-123';
      mockDockerManager.stopContainer.mockResolvedValue(undefined);
      mockDockerManager.removeContainer.mockResolvedValue(undefined);

      // Act
      await orchestrator.removeContainer(containerId);

      // Assert
      expect(mockDockerManager.stopContainer).toHaveBeenCalledWith(containerId);
      expect(mockDockerManager.removeContainer).toHaveBeenCalledWith(containerId);
    });

    it('should handle errors gracefully during stop', async () => {
      // Arrange
      const orchestrator = new DockerOrchestrator();
      const containerId = 'container-123';
      mockDockerManager.stopContainer.mockRejectedValue(new Error('Container already stopped'));
      mockDockerManager.removeContainer.mockResolvedValue(undefined);

      // Act
      await orchestrator.removeContainer(containerId);

      // Assert
      expect(mockDockerManager.stopContainer).toHaveBeenCalledWith(containerId);
      expect(mockDockerManager.removeContainer).toHaveBeenCalledWith(containerId);
    });
  });

  describe('getContainerStatus', () => {
    it('should return container information', async () => {
      // Arrange
      const orchestrator = new DockerOrchestrator();
      const containerId = 'container-123';
      const containerInfo = { state: 'running', ports: [{ HostPort: '8080' }] };
      mockDockerManager.getContainerInfo.mockResolvedValue(containerInfo);

      // Act
      const result = await orchestrator.getContainerStatus(containerId);

      // Assert
      expect(result).toBe(containerInfo);
      expect(mockDockerManager.getContainerInfo).toHaveBeenCalledWith(containerId);
    });

    it('should return null for non-existent container', async () => {
      // Arrange
      const orchestrator = new DockerOrchestrator();
      const containerId = 'non-existent';
      mockDockerManager.getContainerInfo.mockResolvedValue(null);

      // Act
      const result = await orchestrator.getContainerStatus(containerId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('listManagedContainers', () => {
    it('should return list of managed containers', async () => {
      // Arrange
      const orchestrator = new DockerOrchestrator();
      const containers = [
        { id: 'container-1', name: 'mcp-server1' },
        { id: 'container-2', name: 'mcp-server2' }
      ];
      mockDockerManager.listManagedContainers.mockResolvedValue(containers);

      // Act
      const result = await orchestrator.listManagedContainers();

      // Assert
      expect(result).toBe(containers);
      expect(mockDockerManager.listManagedContainers).toHaveBeenCalled();
    });
  });
});