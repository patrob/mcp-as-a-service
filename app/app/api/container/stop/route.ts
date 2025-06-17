export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { stopContainer } from '@/lib/container'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const name = body?.name ?? 'hello-server'
    await stopContainer(name)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to stop' }, { status: 500 })
  }
}
