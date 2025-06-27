import { Server } from 'lucide-react'
import Link from 'next/link'
import { UserMenu } from '@/components/UserMenu'

export default function AboutPage() {
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
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
                Pricing
              </Link>
              <Link href="/docs" className="text-slate-600 hover:text-slate-900 transition-colors">
                Docs
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">About MyMCP</h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            We&apos;re making Model Context Protocol servers accessible to every developer, 
            from startups to enterprise teams building the next generation of AI applications.
          </p>
        </div>
      </section>
    </div>
  )
}