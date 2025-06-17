import './globals.css';
import type { Metadata } from 'next';
import AuthProvider from '@/components/session-provider';

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
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
