import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { GET, POST } from './route';
import { MCPServerManager } from '@/lib/mcp-server-manager';
import { DatabaseManager } from '@/lib/database';
import { isDashboardEnabledServer } from '@/lib/launchdarkly-server';

// Mock all dependencies
vi.mock('next-auth/next');
vi.mock('@/lib/mcp-server-manager');
vi.mock('@/lib/database');
vi.mock('@/lib/user-repository');
vi.mock('@/lib/launchdarkly-server');

describe('/api/servers', () => {
  const mockSession = {
    user: { email: 'test@example.com', name: 'Test User' }
  };

  const mockUser = { id: 123 };
  const mockInstances = [
    { id: 1, name: 'test-server', status: 'running' },
    { id: 2, name: 'another-server', status: 'stopped' }
  ];

  const mockDatabaseManager = {
    query: vi.fn()
  };

  const mockMCPServerManager = {
    getUserServerInstances: vi.fn(),
    createServerInstance: vi.fn()
  };

  const mockUserRepository = {
    findOrCreateUser: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    vi.mocked(getServerSession).mockResolvedValue(mockSession);
    vi.mocked(isDashboardEnabledServer).mockResolvedValue(true);
    vi.mocked(DatabaseManager).mockImplementation(() => mockDatabaseManager as any);
    vi.mocked(MCPServerManager).mockImplementation(() => mockMCPServerManager as any);
    
    // Add UserRepository import and mock
    const { UserRepository } = await import('@/lib/user-repository');
    vi.mocked(UserRepository).mockImplementation(() => mockUserRepository as any);
    
    // Mock console methods
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('GET /api/servers', () => {
    it('should return servers for authenticated user', async () => {
      // Arrange
      mockUserRepository.findOrCreateUser.mockResolvedValue(mockUser);
      mockMCPServerManager.getUserServerInstances.mockResolvedValue(mockInstances);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({ instances: mockInstances });
      expect(mockUserRepository.findOrCreateUser).toHaveBeenCalledWith(
        'test@example.com',
        'Test User'
      );
      expect(mockMCPServerManager.getUserServerInstances).toHaveBeenCalledWith(123);
    });

    it('should create user if not exists and return servers', async () => {
      // Arrange
      mockDatabaseManager.query
        .mockResolvedValueOnce([]) // User doesn't exist
        .mockResolvedValueOnce([mockUser]); // User created
      mockMCPServerManager.getUserServerInstances.mockResolvedValue(mockInstances);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({ instances: mockInstances });
      expect(mockDatabaseManager.query).toHaveBeenCalledWith(
        'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id',
        ['Test User', 'test@example.com']
      );
    });

    it('should return 503 when dashboard is disabled', async () => {
      // Arrange
      vi.mocked(isDashboardEnabledServer).mockResolvedValue(false);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(503);
      expect(data).toEqual({ error: 'Dashboard features are not available' });
    });

    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      vi.mocked(getServerSession).mockResolvedValue(null);

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should return 401 when session has no email', async () => {
      // Arrange
      vi.mocked(getServerSession).mockResolvedValue({ user: { name: 'Test User' } });

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should return 500 on database error', async () => {
      // Arrange
      mockDatabaseManager.query.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await GET();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Internal server error' });
      expect(console.error).toHaveBeenCalledWith('Error fetching servers:', expect.any(Error));
    });
  });

  describe('POST /api/servers', () => {
    const mockRequest = {
      json: vi.fn()
    } as unknown as NextRequest;

    const mockCreateRequest = {
      templateId: 'template-1',
      name: 'new-server',
      config: { port: 3000 }
    };

    const mockCreatedInstance = {
      id: 3,
      name: 'new-server',
      status: 'creating'
    };

    beforeEach(() => {
      vi.mocked(mockRequest.json).mockResolvedValue(mockCreateRequest);
    });

    it('should create server for authenticated user', async () => {
      // Arrange
      mockDatabaseManager.query.mockResolvedValue([mockUser]);
      mockMCPServerManager.createServerInstance.mockResolvedValue(mockCreatedInstance);

      // Act
      const response = await POST(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data).toEqual({ instance: mockCreatedInstance });
      expect(mockMCPServerManager.createServerInstance).toHaveBeenCalledWith(
        123,
        'template-1',
        'new-server',
        { port: 3000 }
      );
    });

    it('should create user if not exists and create server', async () => {
      // Arrange
      mockDatabaseManager.query
        .mockResolvedValueOnce([]) // User doesn't exist
        .mockResolvedValueOnce([mockUser]); // User created
      mockMCPServerManager.createServerInstance.mockResolvedValue(mockCreatedInstance);

      // Act
      const response = await POST(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data).toEqual({ instance: mockCreatedInstance });
      expect(mockDatabaseManager.query).toHaveBeenCalledWith(
        'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id',
        ['Test User', 'test@example.com']
      );
    });

    it('should use default empty config when not provided', async () => {
      // Arrange
      vi.mocked(mockRequest.json).mockResolvedValue({
        templateId: 'template-1',
        name: 'new-server'
        // config not provided
      });
      mockDatabaseManager.query.mockResolvedValue([mockUser]);
      mockMCPServerManager.createServerInstance.mockResolvedValue(mockCreatedInstance);

      // Act
      const response = await POST(mockRequest);

      // Assert
      expect(response.status).toBe(201);
      expect(mockMCPServerManager.createServerInstance).toHaveBeenCalledWith(
        123,
        'template-1',
        'new-server',
        {}
      );
    });

    it('should return 503 when dashboard is disabled', async () => {
      // Arrange
      vi.mocked(isDashboardEnabledServer).mockResolvedValue(false);

      // Act
      const response = await POST(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(503);
      expect(data).toEqual({ error: 'Dashboard features are not available' });
    });

    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      vi.mocked(getServerSession).mockResolvedValue(null);

      // Act
      const response = await POST(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should return 400 when templateId is missing', async () => {
      // Arrange
      vi.mocked(mockRequest.json).mockResolvedValue({
        name: 'new-server',
        config: { port: 3000 }
        // templateId missing
      });

      // Act
      const response = await POST(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Missing required fields' });
    });

    it('should return 400 when name is missing', async () => {
      // Arrange
      vi.mocked(mockRequest.json).mockResolvedValue({
        templateId: 'template-1',
        config: { port: 3000 }
        // name missing
      });

      // Act
      const response = await POST(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Missing required fields' });
    });

    it('should return 400 on manager error with message', async () => {
      // Arrange
      mockDatabaseManager.query.mockResolvedValue([mockUser]);
      mockMCPServerManager.createServerInstance.mockRejectedValue(new Error('Server name already exists'));

      // Act
      const response = await POST(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Server name already exists' });
    });

    it('should return 500 on non-Error exceptions', async () => {
      // Arrange
      mockDatabaseManager.query.mockResolvedValue([mockUser]);
      mockMCPServerManager.createServerInstance.mockRejectedValue('String error');

      // Act
      const response = await POST(mockRequest);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Internal server error' });
    });
  });
});