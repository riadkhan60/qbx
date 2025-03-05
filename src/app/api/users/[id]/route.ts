import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string | string[] } },
) {
  try {
    const id = params.id;

    // Validate that id is a single string
    if (typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkID: id,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
  }
}
