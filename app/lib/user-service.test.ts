import { describe, it, expect, beforeEach, vi } from "vitest";
import { UserService } from "./user-service";

// Mock the database
const mockQuery = vi.fn();
vi.mock("./database", () => ({
  DatabaseManager: {
    getInstance: vi.fn(() => ({
      query: mockQuery,
    })),
  },
}));

// Mock Stripe
const mockStripeCreate = vi.fn();
vi.mock("stripe", () => {
  return {
    default: vi.fn(() => ({
      customers: {
        create: mockStripeCreate,
      },
    })),
  };
});

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    vi.clearAllMocks();
    userService = new UserService();
  });

  it("should create a new user", async () => {
    // Mock database responses
    mockQuery
      .mockResolvedValueOnce([]) // getUserByEmail returns empty (user doesn't exist)
      .mockResolvedValueOnce([
        {
          // createUser returns new user
          id: 1,
          username: "testuser",
          email: "test@example.com",
          stripe_customer_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

    const user = await userService.createUser("test@example.com", "testuser");

    expect(user.email).toBe("test@example.com");
    expect(user.username).toBe("testuser");
    expect(mockQuery).toHaveBeenCalledTimes(2);
  });

  it("should return existing user if email already exists", async () => {
    const existingUser = {
      id: 1,
      username: "existinguser",
      email: "existing@example.com",
      stripe_customer_id: "cus_123",
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockQuery.mockResolvedValueOnce([existingUser]); // getUserByEmail returns existing user

    const user = await userService.createUser(
      "existing@example.com",
      "newusername"
    );

    expect(user).toEqual(existingUser);
    expect(mockQuery).toHaveBeenCalledTimes(1); // Only getUserByEmail called
  });

  it("should get user by email", async () => {
    const existingUser = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      stripe_customer_id: "cus_123",
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockQuery.mockResolvedValueOnce([existingUser]);

    const user = await userService.getUserByEmail("test@example.com");

    expect(user).toEqual(existingUser);
  });

  it("should return null when user not found by email", async () => {
    mockQuery.mockResolvedValueOnce([]); // No user found

    const user = await userService.getUserByEmail("nonexistent@example.com");

    expect(user).toBeNull();
  });
});

