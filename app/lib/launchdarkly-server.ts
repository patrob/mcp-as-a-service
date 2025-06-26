import * as ld from '@launchdarkly/node-server-sdk';
import { FEATURE_FLAGS, DEFAULT_FLAG_VALUES } from './launchdarkly';

let serverClient: ld.LDClient | null = null;

// Initialize server-side LaunchDarkly client
export async function initLaunchDarklyServer(): Promise<ld.LDClient | null> {
  if (serverClient) {
    return serverClient;
  }

  const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY;
  if (!sdkKey) {
    console.warn('LAUNCHDARKLY_SDK_KEY not found. Server-side feature flags will use default values.');
    return null;
  }

  try {
    serverClient = ld.init(sdkKey);
    await serverClient.waitForInitialization();
    return serverClient;
  } catch (error) {
    console.error('Failed to initialize LaunchDarkly server client:', error);
    return null;
  }
}

// Default user context for server-side evaluation
const defaultServerUser: ld.LDUser = {
  key: 'server',
  anonymous: true,
};

// Check if authentication features are enabled (server-side)
export async function isAuthEnabledServer(): Promise<boolean> {
  const client = await initLaunchDarklyServer();
  if (!client) {
    return DEFAULT_FLAG_VALUES[FEATURE_FLAGS.AUTH_ENABLED];
  }

  try {
    return await client.variation(FEATURE_FLAGS.AUTH_ENABLED, defaultServerUser, DEFAULT_FLAG_VALUES[FEATURE_FLAGS.AUTH_ENABLED]);
  } catch (error) {
    console.error('Error checking auth flag:', error);
    return DEFAULT_FLAG_VALUES[FEATURE_FLAGS.AUTH_ENABLED];
  }
}

// Check if dashboard features are enabled (server-side)
export async function isDashboardEnabledServer(): Promise<boolean> {
  const client = await initLaunchDarklyServer();
  if (!client) {
    return DEFAULT_FLAG_VALUES[FEATURE_FLAGS.DASHBOARD_ENABLED];
  }

  try {
    return await client.variation(FEATURE_FLAGS.DASHBOARD_ENABLED, defaultServerUser, DEFAULT_FLAG_VALUES[FEATURE_FLAGS.DASHBOARD_ENABLED]);
  } catch (error) {
    console.error('Error checking dashboard flag:', error);
    return DEFAULT_FLAG_VALUES[FEATURE_FLAGS.DASHBOARD_ENABLED];
  }
}

// Get a specific feature flag value (server-side)
export async function getFeatureFlagServer(flagKey: string, defaultValue: boolean = false): Promise<boolean> {
  const client = await initLaunchDarklyServer();
  if (!client) {
    return defaultValue;
  }

  try {
    return await client.variation(flagKey, defaultServerUser, defaultValue);
  } catch (error) {
    console.error(`Error checking flag ${flagKey}:`, error);
    return defaultValue;
  }
}

// Close the server client (for cleanup)
export async function closeLaunchDarklyServer(): Promise<void> {
  if (serverClient) {
    await serverClient.close();
    serverClient = null;
  }
}