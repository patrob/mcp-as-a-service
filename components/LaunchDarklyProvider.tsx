'use client';

import { LDProvider } from 'launchdarkly-react-client-sdk';
import { ReactNode } from 'react';
import { 
  launchDarklyConfig, 
  defaultUser, 
  getLaunchDarklyClientId,
  DEFAULT_FLAG_VALUES 
} from '@/lib/launchdarkly';

interface LaunchDarklyProviderProps {
  children: ReactNode;
}

export function LaunchDarklyProvider({ children }: LaunchDarklyProviderProps) {
  const clientSideID = getLaunchDarklyClientId();

  // If no client ID is provided, render children with a fallback context
  if (!clientSideID) {
    console.warn('LaunchDarkly client ID not found. Feature flags will use default values.');
    return <>{children}</>;
  }

  return (
    <LDProvider
      clientSideID={clientSideID}
      user={defaultUser}
      options={launchDarklyConfig}
      reactOptions={{
        // Use suspense for better loading states
        useCamelCaseFlagKeys: false,
      }}
      deferInitialization={false}
    >
      {children}
    </LDProvider>
  );
}