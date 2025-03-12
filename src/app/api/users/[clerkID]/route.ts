// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ clerkId: string }> },
// ) {
//   try {
//     const { clerkId } = await params;
//     const user = await prisma.user.findUnique({
//       where: {
//         clerkID: clerkId,
//       },
//     });

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     return NextResponse.json(user, { status: 200 });
//   } catch {
//     return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
//   }
// }

// // PUT /api/users/[clerkId] - Update a user
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: Promise<{ clerkId: string }> },
// ) {
//   try {
//     const { clerkId } = await params;
//     const body = await request.json();
//     const { firstName, lastName, email, phoneNumber } = body;

//     const user = await prisma.user.update({
//       where: {
//         clerkID: clerkId,
//       },
//       data: {
//         firstName,
//         lastName,
//         email,
//         phoneNumber,
//       },
//     });

//     return NextResponse.json(user, { status: 200 });
//   } catch (error) {
//     if ((error as { code: string }).code === 'P2025') {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }
//     return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
//   }
// }

// // DELETE /api/users/[clerkId] - Delete a user
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Promise<{ clerkId: string }> },
// ) {
//   try {
//     const { clerkId } = await params;
//     await prisma.user.delete({
//       where: {
//         clerkID: clerkId,
//       },
//     });

//     return NextResponse.json({ message: 'User deleted' }, { status: 200 });
//   } catch (error) {
//     if ((error as { code: string }).code === 'P2025') {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }
//     return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
//   }
// }
