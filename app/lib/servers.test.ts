import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  fetchServerTemplates,
  fetchUserServers,
  createServerInstance,
  startServer,
  stopServer,
  deleteServer,
} from './servers';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('servers API functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchServerTemplates', () => {
    it('should fetch and return server templates', async () => {
      const mockTemplates = [
        {
          id: 1,
          name: 'GitHub MCP Server',
          description: 'GitHub integration',
          dockerImage: 'mcp-github-server:latest',
          isBuiltin: true,
          isPublic: true,
        },
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ templates: mockTemplates }),
      });

      const result = await fetchServerTemplates();

      expect(mockFetch).toHaveBeenCalledWith('/api/servers/templates');
      expect(result).toEqual(mockTemplates);
    });

    it('should throw error if fetch fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(fetchServerTemplates()).rejects.toThrow('Failed to fetch server templates');
    });
  });

  describe('fetchUserServers', () => {
    it('should fetch and return user server instances', async () => {
      const mockInstances = [
        {
          id: 1,
          userId: 123,
          templateId: 1,
          name: 'my-github-server',
          status: 'running',
          port: 3000,
          template: {
            name: 'GitHub MCP Server',
            description: 'GitHub integration',
          },
        },
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ instances: mockInstances }),
      });

      const result = await fetchUserServers();

      expect(mockFetch).toHaveBeenCalledWith('/api/servers');
      expect(result).toEqual(mockInstances);
    });

    it('should throw error if fetch fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
      });

      await expect(fetchUserServers()).rejects.toThrow('Failed to fetch user servers');
    });
  });

  describe('createServerInstance', () => {
    it('should create server instance successfully', async () => {
      const mockInstance = {
        id: 1,
        userId: 123,
        templateId: 1,
        name: 'test-server',
        status: 'stopped',
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ instance: mockInstance }),
      });

      const result = await createServerInstance(1, 'test-server', { github_token: 'token123' });

      expect(mockFetch).toHaveBeenCalledWith('/api/servers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: 1,
          name: 'test-server',
          config: { github_token: 'token123' },
        }),
      });
      expect(result).toEqual(mockInstance);
    });

    it('should throw error with message from response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Server name already exists' }),
      });

      await expect(createServerInstance(1, 'existing-server', {})).rejects.toThrow(
        'Server name already exists'
      );
    });

    it('should throw default error if no error message in response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({}),
      });

      await expect(createServerInstance(1, 'test-server', {})).rejects.toThrow(
        'Failed to create server'
      );
    });
  });

  describe('startServer', () => {
    it('should start server successfully', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await startServer(1);

      expect(mockFetch).toHaveBeenCalledWith('/api/servers/1/start', {
        method: 'POST',
      });
    });

    it('should throw error if start fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Container start failed' }),
      });

      await expect(startServer(1)).rejects.toThrow('Container start failed');
    });

    it('should throw default error if no error message', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({}),
      });

      await expect(startServer(1)).rejects.toThrow('Failed to start server');
    });
  });

  describe('stopServer', () => {
    it('should stop server successfully', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await stopServer(1);

      expect(mockFetch).toHaveBeenCalledWith('/api/servers/1/stop', {
        method: 'POST',
      });
    });

    it('should throw error if stop fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Container not found' }),
      });

      await expect(stopServer(1)).rejects.toThrow('Container not found');
    });
  });

  describe('deleteServer', () => {
    it('should delete server successfully', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await deleteServer(1);

      expect(mockFetch).toHaveBeenCalledWith('/api/servers/1', {
        method: 'DELETE',
      });
    });

    it('should throw error if deletion fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Server not found' }),
      });

      await expect(deleteServer(1)).rejects.toThrow('Server not found');
    });

    it('should throw default error if no error message', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({}),
      });

      await expect(deleteServer(1)).rejects.toThrow('Failed to delete server');
    });
  });
});