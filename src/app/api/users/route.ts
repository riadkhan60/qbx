
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
// GET /api/users - Get all users
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Error fetching users' },
      { status: 500 },
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phoneNumber, clerkID } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { clerkID },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this clerkID' },
        { status: 409 },
      );
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        clerkID,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
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

// GET /api/users/[clerkId] - Get specific user
