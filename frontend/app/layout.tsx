import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MCP as a Service",
  description: "Manage and run MCP servers easily in the cloud.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
