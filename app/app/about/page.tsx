import { Server, Users, Zap, Shield, Github, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Server className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">MCPaaS</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
                Home
              </Link>
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
                Pricing
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
            Building the future of
            <span className="text-blue-600 block">MCP integration</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            We're making Model Context Protocol servers accessible to every developer, 
            from startups to enterprise teams building the next generation of AI applications.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                The Model Context Protocol represents a fundamental shift in how AI applications 
                interact with external data sources. But setting up and managing MCP servers 
                has been complex and time-consuming.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                MCPaaS was born from our experience building AI applications and struggling 
                with MCP server management. We believe every developer should have access 
                to powerful, reliable MCP infrastructure without the operational overhead.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                  <div className="text-slate-600">Developers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">50M+</div>
                  <div className="text-slate-600">API Calls</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 text-center">
                  <Zap className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900">Fast Setup</h3>
                  <p className="text-sm text-slate-600">Deploy in seconds</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center">
                  <Shield className="h-8 w-8 text-emerald-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900">Secure</h3>
                  <p className="text-sm text-slate-600">Enterprise-grade security</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center">
                  <Server className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900">Scalable</h3>
                  <p className="text-sm text-slate-600">Grows with your needs</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center">
                  <Users className="h-8 w-8 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900">Support</h3>
                  <p className="text-sm text-slate-600">Expert guidance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Meet our team</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We're a team of developers, designers, and AI enthusiasts passionate about making MCP accessible to everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">AJ</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Alex Johnson</h3>
              <p className="text-blue-600 font-medium mb-4">CEO & Co-founder</p>
              <p className="text-slate-600 text-sm mb-4">
                Former engineering lead at a major AI company. Passionate about developer experience and scaling infrastructure.
              </p>
              <div className="flex justify-center space-x-3">
                <a href="#" className="text-slate-400 hover:text-slate-600">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-600">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-600">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">SC</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Sarah Chen</h3>
              <p className="text-blue-600 font-medium mb-4">CTO & Co-founder</p>
              <p className="text-slate-600 text-sm mb-4">
                ML researcher turned infrastructure engineer. Expert in distributed systems and protocol design.
              </p>
              <div className="flex justify-center space-x-3">
                <a href="#" className="text-slate-400 hover:text-slate-600">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-600">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-600">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">MR</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Marcus Rodriguez</h3>
              <p className="text-blue-600 font-medium mb-4">Head of Product</p>
              <p className="text-slate-600 text-sm mb-4">
                Product strategist with deep experience in developer tools and API platforms. Focuses on user experience.
              </p>
              <div className="flex justify-center space-x-3">
                <a href="#" className="text-slate-400 hover:text-slate-600">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-600">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-slate-600">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Values</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The principles that guide how we build products and serve our community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Developer First</h3>
              <p className="text-slate-600 leading-relaxed">
                Every decision we make is viewed through the lens of developer experience. 
                Simple, powerful, and delightful to use.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Security & Privacy</h3>
              <p className="text-slate-600 leading-relaxed">
                We build with security as a foundation, not an afterthought. 
                Your data and applications are protected at every layer.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Community Driven</h3>
              <p className="text-slate-600 leading-relaxed">
                We listen to our community and build the features that matter most. 
                Your feedback shapes our roadmap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to join our mission?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you're building your first AI application or scaling to millions of users, 
            we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-medium hover:bg-blue-50 transition-colors">
              Start Building
            </Link>
            <Link href="/contact" className="border border-blue-400 text-white px-8 py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Server className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold text-white">MCPaaS</span>
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
            © 2024 MCPaaS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}