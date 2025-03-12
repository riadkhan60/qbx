import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  console.log(user);

  // Check if user already exists in the database
  const existingUser = await prisma.account.findUnique({
    where: { clerkId: user.id },
  });

  if (existingUser) {
    // Update existing user
    const updatedUser = await prisma.account.update({
      where: { clerkId: user.id },
      data: {
        email: user.emailAddresses[0]?.emailAddress || existingUser.email,
        firstName: user.firstName || existingUser.firstName,
        lastName: user.lastName || existingUser.lastName,
        imageUrl: user.imageUrl || existingUser.imageUrl,
        username: user.username || existingUser.username,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(updatedUser);
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
        username,
      },
    });
    return NextResponse.json(newUser);
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
