import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authOptions } from './auth';
import { UserService } from './user-service';

// Mock UserService
vi.mock('./user-service');

describe('NextAuth Configuration', () => {
  const baseUrl = 'http://localhost:3000';
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console mocks
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('redirect callback', () => {
    const redirectCallback = authOptions.callbacks?.redirect;

    it('should redirect Chrome DevTools requests to dashboard', async () => {
      if (!redirectCallback) throw new Error('Redirect callback not found');

      const result = await redirectCallback({
        url: 'chrome-extension://some-id/.well-known/appspecific/com.chrome.devtools.json',
        baseUrl
      });

      expect(result).toBe(`${baseUrl}/dashboard`);
    });

    it('should handle relative URLs correctly', async () => {
      if (!redirectCallback) throw new Error('Redirect callback not found');

      const result = await redirectCallback({
        url: '/dashboard',
        baseUrl
      });

      expect(result).toBe(`${baseUrl}/dashboard`);
    });

    it('should allow same origin URLs', async () => {
      if (!redirectCallback) throw new Error('Redirect callback not found');

      const sameOriginUrl = `${baseUrl}/some-page`;
      const result = await redirectCallback({
        url: sameOriginUrl,
        baseUrl
      });

      expect(result).toBe(sameOriginUrl);
    });

    it('should redirect external URLs to dashboard', async () => {
      if (!redirectCallback) throw new Error('Redirect callback not found');

      const result = await redirectCallback({
        url: 'https://malicious-site.com',
        baseUrl
      });

      expect(result).toBe(`${baseUrl}/dashboard`);
    });

    it('should handle URL constructor errors gracefully', async () => {
      if (!redirectCallback) throw new Error('Redirect callback not found');

      // Test with an invalid URL that will cause new URL() to fail
      const result = await redirectCallback({
        url: 'not-a-valid-url',
        baseUrl
      });

      expect(result).toBe(`${baseUrl}/dashboard`);
    });
  });

  describe('signIn callback', () => {
    const signInCallback = authOptions.callbacks?.signIn;
    const mockUserService = {
      createUser: vi.fn()
    };

    beforeEach(() => {
      vi.mocked(UserService).mockImplementation(() => mockUserService as any);
    });

    it('should create user with email and name', async () => {
      if (!signInCallback) throw new Error('SignIn callback not found');

      mockUserService.createUser.mockResolvedValue({ id: 1 });

      const result = await signInCallback({
        user: { email: 'test@example.com', name: 'Test User' },
        account: { provider: 'github' },
        profile: {}
      });

      expect(mockUserService.createUser).toHaveBeenCalledWith('test@example.com', 'Test User');
      expect(result).toBe(true);
    });

    it('should create user with email-derived username when name is missing', async () => {
      if (!signInCallback) throw new Error('SignIn callback not found');

      mockUserService.createUser.mockResolvedValue({ id: 1 });

      const result = await signInCallback({
        user: { email: 'test@example.com' },
        account: { provider: 'google' },
        profile: {}
      });

      expect(mockUserService.createUser).toHaveBeenCalledWith('test@example.com', 'test');
      expect(result).toBe(true);
    });

    it('should still allow sign in when user creation fails', async () => {
      if (!signInCallback) throw new Error('SignIn callback not found');

      mockUserService.createUser.mockRejectedValue(new Error('Database error'));

      const result = await signInCallback({
        user: { email: 'test@example.com', name: 'Test User' },
        account: { provider: 'github' },
        profile: {}
      });

      expect(mockUserService.createUser).toHaveBeenCalledWith('test@example.com', 'Test User');
      expect(result).toBe(true);
      expect(console.error).toHaveBeenCalledWith('Failed to create user in database:', expect.any(Error));
    });

    it('should return true when user has no email', async () => {
      if (!signInCallback) throw new Error('SignIn callback not found');

      const result = await signInCallback({
        user: { name: 'Test User' },
        account: { provider: 'github' },
        profile: {}
      });

      expect(mockUserService.createUser).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('session callback', () => {
    const sessionCallback = authOptions.callbacks?.session;
    const mockUserService = {
      getUserByEmail: vi.fn()
    };

    beforeEach(() => {
      vi.mocked(UserService).mockImplementation(() => mockUserService as any);
    });

    it('should enhance session with user data', async () => {
      if (!sessionCallback) throw new Error('Session callback not found');

      const mockUser = {
        id: 123,
        stripe_customer_id: 'cus_test123'
      };
      mockUserService.getUserByEmail.mockResolvedValue(mockUser);

      const session = {
        user: { email: 'test@example.com', name: 'Test User' }
      };

      const result = await sessionCallback({ session, token: {} });

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result.user.id).toBe(123);
      expect(result.user.stripeCustomerId).toBe('cus_test123');
    });

    it('should handle user not found gracefully', async () => {
      if (!sessionCallback) throw new Error('Session callback not found');

      mockUserService.getUserByEmail.mockResolvedValue(null);

      const session = {
        user: { email: 'test@example.com', name: 'Test User' }
      };

      const result = await sessionCallback({ session, token: {} });

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result.user.id).toBeUndefined();
      expect(result.user.stripeCustomerId).toBeUndefined();
    });

    it('should handle database errors gracefully', async () => {
      if (!sessionCallback) throw new Error('Session callback not found');

      mockUserService.getUserByEmail.mockRejectedValue(new Error('Database error'));

      const session = {
        user: { email: 'test@example.com', name: 'Test User' }
      };

      const result = await sessionCallback({ session, token: {} });

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result.user.id).toBeUndefined();
      expect(result.user.stripeCustomerId).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith('Failed to fetch user data:', expect.any(Error));
    });

    it('should return session unchanged when user has no email', async () => {
      if (!sessionCallback) throw new Error('Session callback not found');

      const session = {
        user: { name: 'Test User' }
      };

      const result = await sessionCallback({ session, token: {} });

      expect(mockUserService.getUserByEmail).not.toHaveBeenCalled();
      expect(result).toEqual(session);
    });
  });

  describe('provider configuration', () => {
    it('should configure GitHub provider with environment variables', () => {
      const githubProvider = authOptions.providers.find(p => p.id === 'github');
      expect(githubProvider).toBeDefined();
      expect(githubProvider?.options?.clientId).toBe(process.env.GITHUB_CLIENT_ID ?? '');
      expect(githubProvider?.options?.clientSecret).toBe(process.env.GITHUB_CLIENT_SECRET ?? '');
    });

    it('should configure Google provider with environment variables', () => {
      const googleProvider = authOptions.providers.find(p => p.id === 'google');
      expect(googleProvider).toBeDefined();
      expect(googleProvider?.options?.clientId).toBe(process.env.GOOGLE_CLIENT_ID ?? '');
      expect(googleProvider?.options?.clientSecret).toBe(process.env.GOOGLE_CLIENT_SECRET ?? '');
    });

    it('should configure custom signin page', () => {
      expect(authOptions.pages?.signIn).toBe('/login');
    });

    it('should use NEXTAUTH_SECRET from environment', () => {
      expect(authOptions.secret).toBe(process.env.NEXTAUTH_SECRET);
    });
  });
});