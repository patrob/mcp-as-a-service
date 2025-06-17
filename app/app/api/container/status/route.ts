export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { isContainerRunning } from '@/lib/container'

export async function GET(req: Request) {
  try {
    const name = new URL(req.url).searchParams.get('name') ?? 'hello-server'
    const running = await isContainerRunning(name)
    return NextResponse.json({ running })
  } catch {
    return NextResponse.json({ running: false }, { status: 500 })
  }
}
