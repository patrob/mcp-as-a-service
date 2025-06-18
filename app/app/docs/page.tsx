"use client";

import {
  Server,
  Code,
  Github,
  Zap,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { UserMenu } from "@/components/UserMenu";
import { useState } from "react";

function CodeBlock({
  children,
  language = "javascript",
}: {
  children: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-slate-900 rounded-lg p-4 overflow-x-auto">
      <button
        onClick={copyToClipboard}
        className="absolute top-3 right-3 p-2 text-slate-400 hover:text-white transition-colors"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
      <pre className="text-sm text-slate-100">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Server className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">MyMCP</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                About
              </Link>
              <UserMenu />
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-4">
                Documentation
              </h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800 text-center">
                  Coming Soon
                </p>
                <p className="text-xs text-amber-700 text-center mt-1">
                  Documentation is in development
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              {/* Header */}
              <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                  Documentation
                </h1>
                <p className="text-xl text-slate-600 mb-8">
                  Documentation for MyMCP
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center mb-4">
                    <Code className="h-12 w-12 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-amber-900 mb-3">
                    To Be Determined
                  </h2>
                  <p className="text-amber-800 leading-relaxed">
                    The MyMCP platform is currently in development. Detailed
                    documentation, API references, and usage examples will be
                    available once the application is fully implemented.
                  </p>
                  <p className="text-amber-700 text-sm mt-4">
                    Check back soon for comprehensive guides and tutorials!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Server className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold text-white">MyMCP</span>
              </div>
              <p className="text-sm text-slate-400">
                Model Context Protocol servers made simple.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="hover:text-white transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/examples"
                    className="hover:text-white transition-colors"
                  >
                    Examples
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/status"
                    className="hover:text-white transition-colors"
                  >
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            © 2024 MyMCP. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
