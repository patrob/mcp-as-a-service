import { Server, Check } from 'lucide-react'
import Link from 'next/link'
import { UserMenu } from '@/components/UserMenu'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Server className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">MyMCP</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
                Home
              </Link>
              <Link href="/docs" className="text-slate-600 hover:text-slate-900 transition-colors">
                Docs
              </Link>
              <Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors">
                About
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">Simple, transparent pricing</h1>
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
              <Link href="/dashboard" className="w-full bg-slate-100 text-slate-700 py-3 px-6 rounded-lg font-medium hover:bg-slate-200 transition-colors block">
                Get Started
              </Link>
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
              <Link href="/contact" className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors block">
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
    </div>
  )
}