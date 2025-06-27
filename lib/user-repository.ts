import { DatabaseManager } from './database';

export interface User {
  id: number;
  email: string;
  username: string;
  stripe_customer_id?: string;
}

/**
 * Repository for user data access operations.
 * Centralizes user management logic to eliminate duplication across API routes.
 */
export class UserRepository {
  private db: DatabaseManager;

  constructor() {
    this.db = new DatabaseManager();
  }

  /**
   * Find an existing user by email, or create a new one if not found.
   * This eliminates the repeated user creation/retrieval logic in API routes.
   */
  async findOrCreateUser(email: string, name?: string): Promise<User> {
    // First try to find existing user
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      return existingUser;
    }

    // Create new user if not found
    const username = name || email;
    const [newUser] = await this.db.query(
      'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id, email, username, stripe_customer_id',
      [username, email]
    );

    if (!newUser) {
      throw new Error('Failed to create user');
    }

    return newUser;
  }

  /**
   * Find a user by email address.
   */
  async findUserByEmail(email: string): Promise<User | null> {
    const [user] = await this.db.query(
      'SELECT id, email, username, stripe_customer_id FROM users WHERE email = $1',
      [email]
    );
    
    return user || null;
  }

  /**
   * Get a user by their ID.
   */
  async getUserById(id: number): Promise<User | null> {
    const [user] = await this.db.query(
      'SELECT id, email, username, stripe_customer_id FROM users WHERE id = $1',
      [id]
    );
    
    return user || null;
  }
}