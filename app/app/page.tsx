'use client';

import { Github, Server, Zap, Shield, Code, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { UserMenu } from '@/components/UserMenu'
import { useDashboardEnabled } from '@/hooks/useFeatureFlags'

export default function HomePage() {
  const { isEnabled: dashboardEnabled } = useDashboardEnabled();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Server className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">MyMCP</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
                Pricing
              </Link>
              <Link href="/docs" className="text-slate-600 hover:text-slate-900 transition-colors">
                Docs
              </Link>
              <Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors">
                About
              </Link>
              <UserMenu />
              {dashboardEnabled && (
                <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            MCP Servers
            <span className="text-blue-600 block">On Demand</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Deploy and manage Model Context Protocol servers instantly. 
            Build powerful LLM applications with pre-configured GitHub integration, 
            custom server support, and seamless orchestration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {dashboardEnabled ? (
              <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <div className="bg-slate-100 text-slate-500 px-8 py-4 rounded-xl font-medium flex items-center justify-center gap-2 cursor-not-allowed">
                Coming Soon
                <Zap className="h-5 w-5" />
              </div>
            )}
            <Link href="/docs" className="border border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-medium hover:bg-slate-50 transition-colors">
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything you need to build with MCP
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From development to production, we provide the tools and infrastructure 
              to seamlessly integrate MCP servers into your applications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <Github className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">GitHub Integration</h3>
              <p className="text-slate-600 leading-relaxed">
                Built-in GitHub MCP server with repository access, issue management, 
                and pull request automation. No configuration required.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-200 transition-colors">
                <Zap className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Instant Deployment</h3>
              <p className="text-slate-600 leading-relaxed">
                Launch MCP servers in seconds with automatic scaling, 
                health monitoring, and zero-downtime updates.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Enterprise Security</h3>
              <p className="text-slate-600 leading-relaxed">
                SOC2 compliant infrastructure with end-to-end encryption, 
                audit logs, and fine-grained access controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no vendor lock-in.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-blue-300 transition-colors">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-slate-900 mb-4">$0<span className="text-lg font-normal text-slate-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  GitHub MCP Server
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  100 API calls/month
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Community support
                </li>
              </ul>
              {dashboardEnabled ? (
                <Link href="/dashboard" className="w-full bg-slate-100 text-slate-700 py-3 px-6 rounded-lg font-medium hover:bg-slate-200 transition-colors block">
                  Get Started
                </Link>
              ) : (
                <div className="w-full bg-slate-100 text-slate-500 py-3 px-6 rounded-lg font-medium text-center cursor-not-allowed">
                  Coming Soon
                </div>
              )}
            </div>

            {/* Pro Tier */}
            <div className="bg-white rounded-2xl p-8 border-2 border-blue-500 hover:border-blue-600 transition-colors relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Pro</h3>
              <div className="text-4xl font-bold text-slate-900 mb-4">$29<span className="text-lg font-normal text-slate-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  All Free features
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  10,000 API calls/month
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Custom MCP servers
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Priority support
                </li>
              </ul>
              <Link href="/pricing" className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors block">
                Start Pro Trial
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-blue-300 transition-colors">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-slate-900 mb-4">Custom</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Unlimited API calls
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Dedicated infrastructure
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  SLA guarantees
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <Check className="h-5 w-5 text-emerald-500" />
                  24/7 support
                </li>
              </ul>
              <Link href="/contact" className="w-full bg-slate-100 text-slate-700 py-3 px-6 rounded-lg font-medium hover:bg-slate-200 transition-colors block">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to accelerate your LLM development?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers using MyMCP to build the next generation of AI applications.
          </p>
          {dashboardEnabled ? (
            <Link href="/dashboard" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-medium hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
              Start Building Today
              <Code className="h-5 w-5" />
            </Link>
          ) : (
            <div className="bg-white/20 text-white px-8 py-4 rounded-xl font-medium inline-flex items-center gap-2 cursor-not-allowed">
              Coming Soon
              <Zap className="h-5 w-5" />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
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
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/examples" className="hover:text-white transition-colors">Examples</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            © 2024 MyMCP. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}