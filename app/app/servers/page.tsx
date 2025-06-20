import { Server } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { BuiltInServerTable } from '@/components/BuiltInServerTable'
import { UserMenu } from '@/components/UserMenu'
import { authOptions } from '@/lib/auth'

export default async function ServersPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }
  return (
    <div className="min-h-screen bg-slate-50">
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
              <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Built-in MCP Servers</h1>
        <BuiltInServerTable />
      </main>
    </div>
  )
}
