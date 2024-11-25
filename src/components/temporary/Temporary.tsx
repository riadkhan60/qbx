'use client';
import { UserButton, useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

export default function Temporary() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    // Handle loading state however you like
    return null;
  }

  if (isSignedIn) {
    return (
      <div>
        Hello {user.firstName}! <UserButton />
      </div>
    );
  }

  return <div>Not signed in</div>;
}
