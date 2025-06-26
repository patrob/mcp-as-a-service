import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { MCPServerManager } from '@/lib/mcp-server-manager';
import { DatabaseManager } from '@/lib/database';

export const dynamic = 'force-dynamic';

async function getUserId(email: string, name?: string): Promise<number | null> {
  const db = new DatabaseManager();
  let [user] = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  
  if (!user) {
    // Create user if doesn't exist
    [user] = await db.query(
      'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id',
      [name || email, email]
    );
  }
  
  return user?.id || null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await getUserId(session.user.email, session.user.name);
    if (!userId) {
      return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
    }

    const manager = new MCPServerManager();
    const instance = await manager.getServerInstance(parseInt(params.id), userId);

    if (!instance) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    return NextResponse.json({ instance });
  } catch (error) {
    console.error('Error fetching server:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await getUserId(session.user.email, session.user.name);
    if (!userId) {
      return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
    }

    const manager = new MCPServerManager();
    await manager.deleteServerInstance(parseInt(params.id), userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting server:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}