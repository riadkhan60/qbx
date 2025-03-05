import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: { clerkId: string } },
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkID: context.params.clerkId, // Fix: use context.params.clerkId
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch  {
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
  }
}
