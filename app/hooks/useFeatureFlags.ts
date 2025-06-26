'use client';

import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk';
import { useEffect, useState } from 'react';
import { FEATURE_FLAGS, DEFAULT_FLAG_VALUES } from '@/lib/launchdarkly';

/**
 * Hook to get all feature flags
 * Returns flags object and loading state
 */
export function useFeatureFlags() {
  const flags = useFlags();
  const ldClient = useLDClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ldClient) {
      // No LaunchDarkly client - use defaults immediately
      setIsLoading(false);
      return;
    }

    // Wait for LaunchDarkly client to be ready
    const checkIfReady = () => {
      setIsLoading(false);
    };

    // The client may already be ready or we'll wait for the ready event
    ldClient.on('ready', checkIfReady);
    ldClient.on('failed', () => setIsLoading(false));

    // Check if already ready
    ldClient.waitForInitialization().then(() => {
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });

    return () => {
      ldClient.off('ready', checkIfReady);
      ldClient.off('failed', () => setIsLoading(false));
    };
  }, [ldClient]);

  // Check for test environment overrides
  const testOverrides = typeof window !== 'undefined' 
    ? (window as any).__FEATURE_FLAGS_OVERRIDE__ 
    : undefined;

  // Merge LaunchDarkly flags with defaults and test overrides
  const mergedFlags = {
    ...DEFAULT_FLAG_VALUES,
    ...flags,
    ...testOverrides,
  };

  return {
    flags: mergedFlags,
    isLoading,
  };
}

/**
 * Hook to check if authentication features are enabled
 */
export function useAuthEnabled(): { isEnabled: boolean; isLoading: boolean } {
  const { flags, isLoading } = useFeatureFlags();
  
  return {
    isEnabled: flags[FEATURE_FLAGS.AUTH_ENABLED] ?? DEFAULT_FLAG_VALUES[FEATURE_FLAGS.AUTH_ENABLED],
    isLoading,
  };
}

/**
 * Hook to check if dashboard features are enabled
 */
export function useDashboardEnabled(): { isEnabled: boolean; isLoading: boolean } {
  const { flags, isLoading } = useFeatureFlags();
  
  return {
    isEnabled: flags[FEATURE_FLAGS.DASHBOARD_ENABLED] ?? DEFAULT_FLAG_VALUES[FEATURE_FLAGS.DASHBOARD_ENABLED],
    isLoading,
  };
}

/**
 * Hook to get a specific feature flag value
 */
export function useFeatureFlag(flagKey: string, defaultValue: boolean = false): { value: boolean; isLoading: boolean } {
  const { flags, isLoading } = useFeatureFlags();
  
  return {
    value: (flags as any)[flagKey] ?? defaultValue,
    isLoading,
  };
}