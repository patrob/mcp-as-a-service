import './globals.css';
import type { Metadata } from 'next';
import AuthProvider from '@/components/session-provider';
import { LaunchDarklyProvider } from '@/components/LaunchDarklyProvider';

export const metadata: Metadata = {
  title: 'MyMCP',
  description: 'MyMCP as a service',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground font-sans antialiased">
        <LaunchDarklyProvider>
          <AuthProvider>{children}</AuthProvider>
        </LaunchDarklyProvider>
      </body>
    </html>
  );
}