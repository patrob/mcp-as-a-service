export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { startContainer } from '@/lib/container'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { image = 'hello-server', name = image, port = 4000 } = body
    await startContainer({ image, name, port })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to start' }, { status: 500 })
  }
}
