import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

// Get all accounts
export async function GET() {
  try {
    const accounts = await prisma.account.findMany();
    return NextResponse.json(accounts);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Update an account
export async function PUT(req: Request) {
  try {
    const { id, ...updateData }: { id: string } & Prisma.AccountUpdateInput =
      await req.json();
    const updatedAccount = await prisma.account.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(updatedAccount);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Delete an account
export async function DELETE(req: Request) {
  try {
    const { id }: { id: string } = await req.json();
    await prisma.account.delete({ where: { id } });
    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

