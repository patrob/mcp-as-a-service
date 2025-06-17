'use client'

import { useState } from 'react'
import { Server, Github, Play, Square, Settings, Plus, Activity, Users, Database, Zap } from 'lucide-react'
import Link from 'next/link'
import { SubscriptionInfo } from '@/components/SubscriptionInfo'

export default function DashboardPage() {
  const [servers, setServers] = useState([
    {
      id: 1,
      name: 'GitHub MCP Server',
      type: 'github',
      status: 'running',
      lastActive: '2 minutes ago',
      requests: 1247,
      uptime: '99.9%'
    },
    {
      id: 2,
      name: 'Custom API Server',
      type: 'custom',
      status: 'stopped',
      lastActive: '1 hour ago',
      requests: 834,
      uptime: '98.7%'
    }
  ])

  const toggleServer = (id: number) => {
    setServers(servers.map(server =>
      server.id === id
        ? { ...server, status: server.status === 'running' ? 'stopped' : 'running' }
        : server
    ))
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
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
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
                <p className="text-2xl font-bold text-slate-900">2</p>
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
            {servers.map((server) => (
              <div key={server.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${server.type === 'github' ? 'bg-slate-100' : 'bg-blue-100'}`}>
                      {server.type === 'github' ? (
                        <Github className="h-6 w-6 text-slate-600" />
                      ) : (
                        <Server className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{server.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                        <span className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${server.status === 'running' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          {server.status}
                        </span>
                        <span>Last active: {server.lastActive}</span>
                        <span>Requests: {server.requests}</span>
                        <span>Uptime: {server.uptime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleServer(server.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        server.status === 'running'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {server.status === 'running' ? (
                        <>
                          <Square className="h-4 w-4" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Launch
                        </>
                      )}
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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