import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { GET, DELETE } from './route';
import { MCPServerManager } from '@/lib/mcp-server-manager';
import { DatabaseManager } from '@/lib/database';

// Mock all dependencies
vi.mock('next-auth/next');
vi.mock('@/lib/mcp-server-manager');
vi.mock('@/lib/database');

describe('/api/servers/[id]', () => {
  const mockSession = {
    user: { email: 'test@example.com', name: 'Test User' }
  };

  const mockUser = { id: 123 };
  const mockServerInstance = {
    id: 1,
    name: 'test-server',
    status: 'running',
    user_id: 123
  };

  const mockDatabaseManager = {
    query: vi.fn()
  };

  const mockMCPServerManager = {
    getServerInstance: vi.fn(),
    deleteServerInstance: vi.fn()
  };

  const mockParams = { params: { id: '1' } };
  const mockRequest = {} as NextRequest;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    vi.mocked(getServerSession).mockResolvedValue(mockSession);
    vi.mocked(DatabaseManager).mockImplementation(() => mockDatabaseManager as any);
    vi.mocked(MCPServerManager).mockImplementation(() => mockMCPServerManager as any);
    
    // Mock console methods
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('GET /api/servers/[id]', () => {
    it('should return server instance for authenticated user', async () => {
      // Arrange
      mockDatabaseManager.query.mockResolvedValue([mockUser]);
      mockMCPServerManager.getServerInstance.mockResolvedValue(mockServerInstance);

      // Act
      const response = await GET(mockRequest, mockParams);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({ instance: mockServerInstance });
      expect(mockMCPServerManager.getServerInstance).toHaveBeenCalledWith(1, 123);
    });

    it('should create user if not exists and return server', async () => {
      // Arrange
      mockDatabaseManager.query
        .mockResolvedValueOnce([]) // User doesn't exist
        .mockResolvedValueOnce([mockUser]); // User created
      mockMCPServerManager.getServerInstance.mockResolvedValue(mockServerInstance);

      // Act
      const response = await GET(mockRequest, mockParams);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({ instance: mockServerInstance });
      expect(mockDatabaseManager.query).toHaveBeenCalledWith(
        'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id',
        ['Test User', 'test@example.com']
      );
    });

    it('should use email as username when name is not provided', async () => {
      // Arrange
      vi.mocked(getServerSession).mockResolvedValue({
        user: { email: 'test@example.com' }
      });
      mockDatabaseManager.query
        .mockResolvedValueOnce([]) // User doesn't exist
        .mockResolvedValueOnce([mockUser]); // User created
      mockMCPServerManager.getServerInstance.mockResolvedValue(mockServerInstance);

      // Act
      const response = await GET(mockRequest, mockParams);

      // Assert
      expect(response.status).toBe(200);
      expect(mockDatabaseManager.query).toHaveBeenCalledWith(
        'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id',
        ['test@example.com', 'test@example.com']
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      vi.mocked(getServerSession).mockResolvedValue(null);

      // Act
      const response = await GET(mockRequest, mockParams);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should return 401 when session has no email', async () => {
      // Arrange
      vi.mocked(getServerSession).mockResolvedValue({ user: { name: 'Test User' } });

      // Act
      const response = await GET(mockRequest, mockParams);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should return 500 when user creation fails', async () => {
      // Arrange
      mockDatabaseManager.query.mockResolvedValue([]); // User doesn't exist and creation fails

      // Act
      const response = await GET(mockRequest, mockParams);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to get user' });
    });

    it('should return 404 when server is not found', async () => {
      // Arrange
      mockDatabaseManager.query.mockResolvedValue([mockUser]);
      mockMCPServerManager.getServerInstance.mockResolvedValue(null);

      // Act
      const response = await GET(mockRequest, mockParams);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Server not found' });
    });

    it('should return 500 on database error', async () => {
      // Arrange
      mockDatabaseManager.query.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await GET(mockRequest, mockParams);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Internal server error' });
      expect(console.error).toHaveBeenCalledWith('Error fetching server:', expect.any(Error));
    });

    it('should handle invalid server ID gracefully', async () => {
      // Arrange
      const invalidParams = { params: { id: 'not-a-number' } };
      mockDatabaseManager.query.mockResolvedValue([mockUser]);
      mockMCPServerManager.getServerInstance.mockResolvedValue(null);

      // Act
      const response = await GET(mockRequest, invalidParams);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Server not found' });
      expect(mockMCPServerManager.getServerInstance).toHaveBeenCalledWith(NaN, 123);
    });
  });

  describe('DELETE /api/servers/[id]', () => {
    it('should delete server instance for authenticated user', async () => {
      // Arrange
      mockDatabaseManager.query.mockResolvedValue([mockUser]);
      mockMCPServerManager.deleteServerInstance.mockResolvedValue(undefined);

      // Act
      const response = await DELETE(mockRequest, mockParams);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
      expect(mockMCPServerManager.deleteServerInstance).toHaveBeenCalledWith(1, 123);
    });

    it('should create user if not exists and delete server', async () => {
      // Arrange
      mockDatabaseManager.query
        .mockResolvedValueOnce([]) // User doesn't exist
        .mockResolvedValueOnce([mockUser]); // User created
      mockMCPServerManager.deleteServerInstance.mockResolvedValue(undefined);

      // Act
      const response = await DELETE(mockRequest, mockParams);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
      expect(mockDatabaseManager.query).toHaveBeenCalledWith(
        'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id',
        ['Test User', 'test@example.com']
      );
    });

    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      vi.mocked(getServerSession).mockResolvedValue(null);

      // Act
      const response = await DELETE(mockRequest, mockParams);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should return 500 when user creation fails', async () => {
      // Arrange
      mockDatabaseManager.query.mockResolvedValue([]); // User doesn't exist and creation fails

      // Act
      const response = await DELETE(mockRequest, mockParams);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to get user' });
    });

    it('should return 400 on manager error with message', async () => {
      // Arrange
      mockDatabaseManager.query.mockResolvedValue([mockUser]);
      mockMCPServerManager.deleteServerInstance.mockRejectedValue(new Error('Server not found or not owned by user'));

      // Act
      const response = await DELETE(mockRequest, mockParams);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Server not found or not owned by user' });
    });

    it('should return 500 on non-Error exceptions', async () => {
      // Arrange
      mockDatabaseManager.query.mockResolvedValue([mockUser]);
      mockMCPServerManager.deleteServerInstance.mockRejectedValue('String error');

      // Act
      const response = await DELETE(mockRequest, mockParams);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Internal server error' });
    });

    it('should handle invalid server ID gracefully', async () => {
      // Arrange
      const invalidParams = { params: { id: 'not-a-number' } };
      mockDatabaseManager.query.mockResolvedValue([mockUser]);
      mockMCPServerManager.deleteServerInstance.mockResolvedValue(undefined);

      // Act
      const response = await DELETE(mockRequest, invalidParams);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
      expect(mockMCPServerManager.deleteServerInstance).toHaveBeenCalledWith(NaN, 123);
    });
  });
});