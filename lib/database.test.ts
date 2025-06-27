import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DatabaseManager } from './database';

// Mock the pg module
const mockClient = {
  query: vi.fn(),
  release: vi.fn(),
};

const mockPool = {
  connect: vi.fn(() => Promise.resolve(mockClient)),
  end: vi.fn(),
};

vi.mock('pg', () => ({
  Pool: vi.fn(() => mockPool),
}));

describe('DatabaseManager', () => {
  let db: DatabaseManager;

  beforeEach(() => {
    db = new DatabaseManager();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('query', () => {
    it('should execute query and return rows', async () => {
      const mockRows = [{ id: 1, name: 'test' }];
      mockClient.query.mockResolvedValue({ rows: mockRows });

      const result = await db.query('SELECT * FROM users WHERE id = $1', [1]);

      expect(mockPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [1]);
      expect(mockClient.release).toHaveBeenCalled();
      expect(result).toEqual(mockRows);
    });

    it('should release client even if query fails', async () => {
      mockClient.query.mockRejectedValue(new Error('Database error'));

      await expect(db.query('SELECT * FROM users')).rejects.toThrow('Database error');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should handle queries without parameters', async () => {
      const mockRows = [{ count: 5 }];
      mockClient.query.mockResolvedValue({ rows: mockRows });

      const result = await db.query('SELECT COUNT(*) as count FROM users');

      expect(mockClient.query).toHaveBeenCalledWith('SELECT COUNT(*) as count FROM users', undefined);
      expect(result).toEqual(mockRows);
    });
  });

  describe('transaction', () => {
    it('should execute multiple queries in transaction and commit', async () => {
      const mockRows1 = [{ id: 1 }];
      const mockRows2 = [{ id: 2 }];
      
      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: mockRows1 }) // First query
        .mockResolvedValueOnce({ rows: mockRows2 }) // Second query
        .mockResolvedValueOnce({ rows: [] }); // COMMIT

      const result = await db.transaction(async (query) => {
        const result1 = await query('INSERT INTO users (name) VALUES ($1) RETURNING id', ['user1']);
        const result2 = await query('INSERT INTO users (name) VALUES ($1) RETURNING id', ['user2']);
        return { first: result1, second: result2 };
      });

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('INSERT INTO users (name) VALUES ($1) RETURNING id', ['user1']);
      expect(mockClient.query).toHaveBeenCalledWith('INSERT INTO users (name) VALUES ($1) RETURNING id', ['user2']);
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(result).toEqual({ first: mockRows1, second: mockRows2 });
    });

    it('should rollback transaction on error', async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockRejectedValueOnce(new Error('Query failed')) // Failed query
        .mockResolvedValueOnce({ rows: [] }); // ROLLBACK

      await expect(db.transaction(async (query) => {
        await query('INSERT INTO users (name) VALUES ($1)', ['user1']);
        throw new Error('Query failed');
      })).rejects.toThrow('Query failed');

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('singleton behavior', () => {
    it('should return the same instance', () => {
      const instance1 = DatabaseManager.getInstance();
      const instance2 = DatabaseManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('close', () => {
    it('should end the connection pool', async () => {
      await db.close();
      expect(mockPool.end).toHaveBeenCalled();
    });
  });
});