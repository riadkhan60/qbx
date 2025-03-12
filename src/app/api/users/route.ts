
// import { NextRequest, NextResponse } from 'next/server';

// import { prisma } from '@/lib/prisma';
// // GET /api/users - Get all users
// export async function GET() {
//   try {
//     const users = await prisma.user.findMany();
//     return NextResponse.json(users, { status: 200 });
//   } catch {
//     return NextResponse.json(
//       { error: 'Error fetching users' },
//       { status: 500 },
//     );
//   }
// }

// // POST /api/users - Create a new user
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { firstName, lastName, email, phoneNumber, clerkID } = body;

//     // Check if user already exists
//     const existingUser = await prisma.user.findFirst({
//       where: { clerkID },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'User already exists with this clerkID' },
//         { status: 409 },
//       );
//     }

//     const user = await prisma.user.create({
//       data: {
//         firstName,
//         lastName,
//         email,
//         phoneNumber,
//         clerkID,
//       },
//     });

//     return NextResponse.json(user, { status: 201 });
//   } catch {
//     return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
//   }
// }



// // GET /api/users/[clerkId] - Get specific user
