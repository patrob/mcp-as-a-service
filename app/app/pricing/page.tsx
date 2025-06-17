import { Check, X, Zap, Shield, Headphones } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-slate-900">MCPaaS</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
                Home
              </Link>
              <Link href="/docs" className="text-slate-600 hover:text-slate-900 transition-colors">
                Docs
              </Link>
              <Link href="/login" className="text-slate-600 hover:text-slate-900 transition-colors">
                Sign In
              </Link>
              <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="text-slate-600">Monthly</span>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
            </button>
            <span className="text-slate-900 font-medium">Annual</span>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full">Save 20%</span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
                <div className="text-5xl font-bold text-slate-900 mb-2">$0</div>
                <p className="text-slate-600">Perfect for trying out MCPaaS</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">GitHub MCP Server</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">100 API calls per month</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Community support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Basic monitoring</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="h-5 w-5 text-slate-300 flex-shrink-0" />
                  <span className="text-slate-400">Custom servers</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="h-5 w-5 text-slate-300 flex-shrink-0" />
                  <span className="text-slate-400">Priority support</span>
                </li>
              </ul>
              
              <Link href="/dashboard" className="w-full bg-slate-100 text-slate-700 py-3 px-6 rounded-xl font-medium hover:bg-slate-200 transition-colors text-center block">
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-blue-500 hover:border-blue-600 transition-all duration-300 hover:shadow-xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Most Popular
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Pro</h3>
                <div className="text-5xl font-bold text-slate-900 mb-2">$29</div>
                <p className="text-slate-600">For growing applications</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Everything in Free</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">10,000 API calls per month</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Custom MCP servers</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Advanced monitoring & analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Priority support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">99.9% uptime SLA</span>
                </li>
              </ul>
              
              <Link href="/dashboard" className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors text-center block">
                Start Pro Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
                <div className="text-5xl font-bold text-slate-900 mb-2">Custom</div>
                <p className="text-slate-600">For large-scale deployments</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Everything in Pro</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Unlimited API calls</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Dedicated infrastructure</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">Custom integrations</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">24/7 dedicated support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700">99.99% uptime SLA</span>
                </li>
              </ul>
              
              <Link href="/contact" className="w-full bg-slate-100 text-slate-700 py-3 px-6 rounded-xl font-medium hover:bg-slate-200 transition-colors text-center block">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Compare all features</h2>
            <p className="text-xl text-slate-600">See what&apos;s included in each plan</p>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Features</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-slate-900">Free</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-slate-900">Pro</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-slate-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">API Calls</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">100/month</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">10,000/month</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">GitHub MCP Server</td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">Custom Servers</td>
                    <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">Advanced Monitoring</td>
                    <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">Support</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">Community</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">Priority</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">24/7 Dedicated</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">SLA</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">99%</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">99.9%</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">99.99%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently asked questions</h2>
            <p className="text-xl text-slate-600">Everything you need to know about our pricing</p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-slate-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and you&apos;ll be charged or refunded accordingly.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">What happens if I exceed my API limits?</h3>
              <p className="text-slate-600">Your requests will be temporarily throttled. You can upgrade your plan or purchase additional API calls to continue service.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Do you offer refunds?</h3>
              <p className="text-slate-600">We offer a 30-day money-back guarantee for annual plans. Monthly subscriptions can be cancelled at any time.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">How does billing work?</h3>
              <p className="text-slate-600">We bill monthly or annually based on your chosen plan. All payments are processed securely through Stripe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto bg-blue-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of developers building with MCPaaS</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors">
              Start Free Trial
            </Link>
            <Link href="/contact" className="border border-blue-400 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}