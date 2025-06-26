import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { MCPServerManager } from '@/lib/mcp-server-manager';
import { DatabaseManager } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user in database
    const db = new DatabaseManager();
    let [user] = await db.query('SELECT id FROM users WHERE email = $1', [session.user.email]);
    
    if (!user) {
      // Create user if doesn't exist
      [user] = await db.query(
        'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id',
        [session.user.name || session.user.email, session.user.email]
      );
    }

    const manager = new MCPServerManager();
    const instances = await manager.getUserServerInstances(user.id);

    return NextResponse.json({ instances });
  } catch (error) {
    console.error('Error fetching servers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { templateId, name, config } = await request.json();

    if (!templateId || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get or create user in database
    const db = new DatabaseManager();
    let [user] = await db.query('SELECT id FROM users WHERE email = $1', [session.user.email]);
    
    if (!user) {
      // Create user if doesn't exist
      [user] = await db.query(
        'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id',
        [session.user.name || session.user.email, session.user.email]
      );
    }

    const manager = new MCPServerManager();
    const instance = await manager.createServerInstance(
      user.id,
      templateId,
      name,
      config || {}
    );

    return NextResponse.json({ instance }, { status: 201 });
  } catch (error) {
    console.error('Error creating server:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}