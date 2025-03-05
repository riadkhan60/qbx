'use client';
import { UserButton, useUser } from '@clerk/nextjs';
import React, { useEffect } from 'react';


export default function Temporary() {
  const { isSignedIn, user, isLoaded } = useUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sessions, setSessions] = React.useState<any[]>([]);



  useEffect(() => {
    async function fetchUser() {
      if (isLoaded) {
        console.log(user);
        const userSessions = await user?.getSessions();
        setSessions(userSessions || []);
      }
    }
    fetchUser();
  }, [user, isLoaded]);


    if (!isLoaded) {
      // Handle loading state however you like
      return null;
    }

  if (isSignedIn) {
    return (
      <div>
        Hello {user.firstName}! <UserButton />
        {sessions.map((session) => (
          <div onClick={() => session.revoke()} key={session.id}>{session.latestActivity.deviceType}</div>
        ))}
      </div>
    );
  }

  return <div>Not signed in</div>;
}
