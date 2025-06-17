'use client'
import { useEffect, useState } from 'react'
import { getSubscription, Subscription } from '@/lib/subscription'

export function SubscriptionInfo() {
  const [sub, setSub] = useState<Subscription | null>(null)
  useEffect(() => {
    getSubscription().then(setSub).catch(() => {})
  }, [])
  if (!sub) return null
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
      <h3 className="text-xl font-semibold text-slate-900 mb-2">Subscription</h3>
      <p className="text-slate-600">Plan: {sub.plan}</p>
      <p className="text-slate-600">MCP Usage: {sub.usage}</p>
    </div>
  )
}
