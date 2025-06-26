'use client';

import { LDClient, initialize, LDOptions } from 'launchdarkly-react-client-sdk';

// LaunchDarkly configuration
export const launchDarklyConfig: LDOptions = {
  // Wait up to 3 seconds for flags before timing out
  bootstrap: 'localStorage',
  streaming: true,
};

// Default user context for anonymous users
export const defaultUser = {
  kind: 'user',
  key: 'anonymous',
  anonymous: true,
};

// Feature flag keys - centralized for type safety
export const FEATURE_FLAGS = {
  AUTH_ENABLED: 'auth-enabled',
  DASHBOARD_ENABLED: 'dashboard-enabled',
} as const;

// Default flag values when LaunchDarkly is unavailable
export const DEFAULT_FLAG_VALUES = {
  [FEATURE_FLAGS.AUTH_ENABLED]: false,
  [FEATURE_FLAGS.DASHBOARD_ENABLED]: false,
};

// Helper function to get LaunchDarkly client ID from environment
export function getLaunchDarklyClientId(): string {
  const clientId = process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID;
  if (!clientId) {
    console.warn('NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID not found. Feature flags will use default values.');
    return '';
  }
  return clientId;
}

// Initialize LaunchDarkly client (only called once)
export let ldClient: LDClient | null = null;

export function initializeLaunchDarkly(): LDClient | null {
  if (typeof window === 'undefined') {
    // Server-side rendering - return null
    return null;
  }

  const clientId = getLaunchDarklyClientId();
  if (!clientId) {
    return null;
  }

  try {
    ldClient = initialize(clientId, defaultUser, launchDarklyConfig);
    return ldClient;
  } catch (error) {
    console.error('Failed to initialize LaunchDarkly:', error);
    return null;
  }
}