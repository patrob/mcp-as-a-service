import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserRepository } from './user-repository';
import { DatabaseManager } from './database';

// Mock DatabaseManager
vi.mock('./database');

describe('UserRepository', () => {
  const mockDatabaseManager = {
    query: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(DatabaseManager).mockImplementation(() => mockDatabaseManager as any);
  });

  describe('findOrCreateUser', () => {
    it('should return existing user if found', async () => {
      // Arrange
      const repository = new UserRepository();
      const existingUser = { id: 123, email: 'test@example.com', username: 'testuser' };
      mockDatabaseManager.query.mockResolvedValue([existingUser]);

      // Act
      const result = await repository.findOrCreateUser('test@example.com', 'Test User');

      // Assert
      expect(result).toEqual(existingUser);
      expect(mockDatabaseManager.query).toHaveBeenCalledTimes(1);
      expect(mockDatabaseManager.query).toHaveBeenCalledWith(
        'SELECT id, email, username, stripe_customer_id FROM users WHERE email = $1',
        ['test@example.com']
      );
    });

    it('should create new user if not found', async () => {
      // Arrange
      const repository = new UserRepository();
      const newUser = { id: 456, email: 'new@example.com', username: 'New User' };
      mockDatabaseManager.query
        .mockResolvedValueOnce([]) // User not found
        .mockResolvedValueOnce([newUser]); // User created

      // Act
      const result = await repository.findOrCreateUser('new@example.com', 'New User');

      // Assert
      expect(result).toEqual(newUser);
      expect(mockDatabaseManager.query).toHaveBeenCalledTimes(2);
      expect(mockDatabaseManager.query).toHaveBeenNthCalledWith(1,
        'SELECT id, email, username, stripe_customer_id FROM users WHERE email = $1',
        ['new@example.com']
      );
      expect(mockDatabaseManager.query).toHaveBeenNthCalledWith(2,
        'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id, email, username, stripe_customer_id',
        ['New User', 'new@example.com']
      );
    });

    it('should use email as username when name is not provided', async () => {
      // Arrange
      const repository = new UserRepository();
      const newUser = { id: 789, email: 'auto@example.com', username: 'auto@example.com' };
      mockDatabaseManager.query
        .mockResolvedValueOnce([]) // User not found
        .mockResolvedValueOnce([newUser]); // User created

      // Act
      const result = await repository.findOrCreateUser('auto@example.com');

      // Assert
      expect(result).toEqual(newUser);
      expect(mockDatabaseManager.query).toHaveBeenNthCalledWith(2,
        'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id, email, username, stripe_customer_id',
        ['auto@example.com', 'auto@example.com']
      );
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const repository = new UserRepository();
      mockDatabaseManager.query.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(repository.findOrCreateUser('error@example.com', 'Error User'))
        .rejects.toThrow('Database connection failed');
    });

    it('should handle creation failure gracefully', async () => {
      // Arrange
      const repository = new UserRepository();
      mockDatabaseManager.query
        .mockResolvedValueOnce([]) // User not found
        .mockResolvedValueOnce([]); // Creation returns empty (shouldn't happen)

      // Act & Assert
      await expect(repository.findOrCreateUser('fail@example.com', 'Fail User'))
        .rejects.toThrow('Failed to create user');
    });
  });

  describe('findUserByEmail', () => {
    it('should return user if found', async () => {
      // Arrange
      const repository = new UserRepository();
      const user = { id: 123, email: 'test@example.com', username: 'testuser' };
      mockDatabaseManager.query.mockResolvedValue([user]);

      // Act
      const result = await repository.findUserByEmail('test@example.com');

      // Assert
      expect(result).toEqual(user);
      expect(mockDatabaseManager.query).toHaveBeenCalledWith(
        'SELECT id, email, username, stripe_customer_id FROM users WHERE email = $1',
        ['test@example.com']
      );
    });

    it('should return null if user not found', async () => {
      // Arrange
      const repository = new UserRepository();
      mockDatabaseManager.query.mockResolvedValue([]);

      // Act
      const result = await repository.findUserByEmail('notfound@example.com');

      // Assert
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      // Arrange
      const repository = new UserRepository();
      mockDatabaseManager.query.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(repository.findUserByEmail('error@example.com'))
        .rejects.toThrow('Database error');
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      // Arrange
      const repository = new UserRepository();
      const user = { id: 123, email: 'test@example.com', username: 'testuser' };
      mockDatabaseManager.query.mockResolvedValue([user]);

      // Act
      const result = await repository.getUserById(123);

      // Assert
      expect(result).toEqual(user);
      expect(mockDatabaseManager.query).toHaveBeenCalledWith(
        'SELECT id, email, username, stripe_customer_id FROM users WHERE id = $1',
        [123]
      );
    });

    it('should return null if user not found', async () => {
      // Arrange
      const repository = new UserRepository();
      mockDatabaseManager.query.mockResolvedValue([]);

      // Act
      const result = await repository.getUserById(999);

      // Assert
      expect(result).toBeNull();
    });
  });
});