import { DatabaseManager } from "./database";
import { UserRepository } from "./user-repository";
import Stripe from "stripe";

export interface User {
  id: number;
  username: string;
  email: string;
  stripe_customer_id?: string;
  created_at: Date;
  updated_at: Date;
}

export class UserService {
  private db: DatabaseManager;
  private userRepository: UserRepository;
  private stripe?: Stripe;

  constructor() {
    this.db = DatabaseManager.getInstance();
    this.userRepository = new UserRepository();
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-05-28.basil",
      });
    }
  }

  async createUser(email: string, username: string): Promise<User> {
    // Check if user already exists
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      return existingUser;
    }

    // Create Stripe customer if Stripe is configured
    let stripeCustomerId: string | undefined;
    if (this.stripe) {
      try {
        const customer = await this.stripe.customers.create({
          email,
          name: username,
        });
        stripeCustomerId = customer.id;
      } catch (error) {
        console.error("Failed to create Stripe customer:", error);
        // Continue without Stripe customer ID
      }
    }

    // Create user in database
    const [user] = await this.db.query(
      `INSERT INTO users (username, email, stripe_customer_id, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) 
       RETURNING *`,
      [username, email, stripeCustomerId]
    );

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    // Use UserRepository for basic user retrieval, but return full User object with timestamps
    const basicUser = await this.userRepository.findUserByEmail(email);
    if (!basicUser) {
      return null;
    }

    // Get full user details including timestamps
    const [user] = await this.db.query("SELECT * FROM users WHERE id = $1", [
      basicUser.id,
    ]);
    return user || null;
  }

  async getUserById(id: number): Promise<User | null> {
    const [user] = await this.db.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    return user || null;
  }

  async updateStripeCustomerId(
    userId: number,
    stripeCustomerId: string
  ): Promise<void> {
    await this.db.query(
      "UPDATE users SET stripe_customer_id = $1, updated_at = NOW() WHERE id = $2",
      [stripeCustomerId, userId]
    );
  }
}

