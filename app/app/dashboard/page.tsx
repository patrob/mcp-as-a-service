'use client'

import { useEffect, useState } from 'react'
import { Server, Github, Play, Square, Settings, Plus, Activity, Users, Database, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { SubscriptionInfo } from '@/components/SubscriptionInfo'
import { UserMenu } from '@/components/UserMenu'
import { fetchUserServers, startServer, stopServer, type ServerInstance } from '@/lib/servers'
import { useDashboardEnabled } from '@/hooks/useFeatureFlags'
import { ComingSoon } from '@/components/ComingSoon'

export default function DashboardPage() {
  const { isEnabled: dashboardEnabled, isLoading: flagsLoading } = useDashboardEnabled();
  
  // Show loading state while feature flags are being fetched
  if (flagsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If dashboard is not enabled, show coming soon page
  if (!dashboardEnabled) {
    return <ComingSoon feature="dashboard" />;
  }
  const { data: session, status } = useSession()
  const router = useRouter()
  const [servers, setServers] = useState<ServerInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const loadServers = async () => {
    try {
      const data = await fetchUserServers()
      setServers(data)
    } catch (error) {
      console.error('Error loading servers:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleServer = async (server: ServerInstance) => {
    setActionLoading(server.id)
    try {
      if (server.status === 'running') {
        await stopServer(server.id)
      } else {
        await startServer(server.id)
      }
      // Reload servers to get updated status
      await loadServers()
    } catch (error) {
      console.error('Error toggling server:', error)
      alert('Failed to toggle server')
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    } else if (status === 'authenticated') {
      loadServers()
    }
  }, [status, router])

  if (status !== 'authenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Server className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">MyMCP</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button className="text-slate-600 hover:text-slate-900 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Manage your MCP servers and monitor performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Servers</p>
                <p className="text-2xl font-bold text-slate-900">
                  {loading ? '...' : servers.filter(s => s.status === 'running').length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Server className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">API Requests</p>
                <p className="text-2xl font-bold text-slate-900">2,081</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Uptime</p>
                <p className="text-2xl font-bold text-slate-900">99.2%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Data Processed</p>
                <p className="text-2xl font-bold text-slate-900">1.2GB</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
        <SubscriptionInfo />

        {/* Servers Section */}
        <div className="bg-white rounded-xl border border-slate-200 mb-8">
          <div className="p-6 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">MCP Servers</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Custom Server
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-slate-200">
            {loading ? (
              <div className="p-6 text-center text-slate-600">Loading servers...</div>
            ) : servers.length === 0 ? (
              <div className="p-6 text-center text-slate-600">
                No servers created yet. Visit the servers page to create your first server.
              </div>
            ) : (
              servers.map((server) => (
                <div key={server.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-blue-100">
                        <Server className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{server.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                          <span className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${
                              server.status === 'running' ? 'bg-green-500' : 
                              server.status === 'starting' ? 'bg-yellow-500' :
                              server.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                            }`}></div>
                            {server.status}
                          </span>
                          {server.port && <span>Port: {server.port}</span>}
                          {server.template && <span>Type: {server.template.name}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleServer(server)}
                        disabled={actionLoading === server.id || server.status === 'starting'}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 ${
                          server.status === 'running'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {actionLoading === server.id ? (
                          'Loading...'
                        ) : server.status === 'running' ? (
                          <>
                            <Square className="h-4 w-4" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            Start
                          </>
                        )}
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Github className="h-5 w-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-900">Deploy GitHub Server</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-900">Add Custom Server</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-900">Server Configuration</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-600">GitHub server deployed</span>
                <span className="text-xs text-slate-400 ml-auto">2m ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-slate-600">API request processed</span>
                <span className="text-xs text-slate-400 ml-auto">5m ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-slate-600">Server configuration updated</span>
                <span className="text-xs text-slate-400 ml-auto">1h ago</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Usage Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-600">API Calls</span>
                  <span className="text-sm font-medium text-slate-900">2,081 / 10,000</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20.8%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-600">Storage</span>
                  <span className="text-sm font-medium text-slate-900">1.2GB / 5GB</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}