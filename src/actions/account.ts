// Adjust path to your Prisma client
import { User } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function syncUserWithDatabase(user: User | null) {
  if (!user) return null;

  // Check if user already exists in database
  const existingUser = await prisma.account.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (existingUser) {
    // Update user if they exist
    return await prisma.account.update({
      where: {
        clerkId: user.id,
      },
      data: {
        email: user.emailAddresses[0]?.emailAddress || existingUser.email,
        firstName: user.firstName || existingUser.firstName,
        lastName: user.lastName || existingUser.lastName,
        imageUrl: user.imageUrl || existingUser.imageUrl,
        username: user.username || existingUser.username,
        updatedAt: new Date(),
      },
    });
  } else {
    // Create new user if they don't exist
    return await prisma.account.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        imageUrl: user.imageUrl || '',
        username: user.username || '',
      },
    });
  }
}
