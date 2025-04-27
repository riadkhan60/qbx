import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check if user already exists in the database
    const existingUser = await prisma.account.findUnique({
      where: { clerkId: user.id },
    });

    

    if (existingUser) {
      // Return an object with the ID
      return NextResponse.json({ id: existingUser.id });
    } else {
      // Generate a unique username
      let username = user.username?.trim() || '';
      if (!username) {
        const baseUsername =
          user.firstName?.toLowerCase().replace(/\s+/g, '') || 'qbx';
        username = await generateUniqueUsername(baseUsername);
      }

      // Create new user if they don't exist
      const newUser = await prisma.account.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          imageUrl: user.imageUrl || '',
          phoneNumber: (user.unsafeMetadata?.phoneNumber as string) || '',
          username,
        },
      });
      return NextResponse.json({ id: newUser.id });
    }
  } catch (error) {
    console.error('Error in sync-user API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}


// Function to generate a unique username
async function generateUniqueUsername(baseUsername: string) {
  let username = baseUsername;
  let isUnique = false;
  let counter = 1;

  while (!isUnique) {
    const existingUser = await prisma.account.findUnique({
      where: { username },
    });
    if (!existingUser) {
      isUnique = true;
    } else {
      username = `${baseUsername}${counter}`;
      counter++;
    }
  }

  return username;
}
