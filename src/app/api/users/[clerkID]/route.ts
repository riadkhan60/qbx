import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { clerkId: string } },
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkID: params.clerkId, 
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


// PUT /api/users/[clerkId] - Update a user
export async function PUT(
  request: NextRequest,
  { params }: { params: { clerkId: string } },
) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phoneNumber } = body;

    const user = await prisma.user.update({
      where: {
        clerkID: params.clerkId,
      },
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    if ((error as { code: string }).code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}

// DELETE /api/users/[clerkId] - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { clerkId: string } },
) {
  try {
    await prisma.user.delete({
      where: {
        clerkID: params.clerkId,
      },
    });

    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } catch (error) {
    if ((error as { code: string }).code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
  }
}