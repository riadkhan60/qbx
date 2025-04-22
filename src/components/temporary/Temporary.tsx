'use client';
import { useUserContext } from '@/contexts/UserContext/UserContextProvoder';
import { UserButton, useUser } from '@clerk/nextjs';
import React, { useEffect } from 'react';
import { EmptyState } from '@/components/CreateBusiness/EmptyState';
import { Files, FileText, Link } from 'lucide-react';

export default function Temporary() {
  const { isSignedIn, user, isLoaded } = useUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sessions, setSessions] = React.useState<any[]>([]);
  const { accountId } = useUserContext();
  console.log(accountId);


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
          <div onClick={() => session.revoke()} key={session.id}>
            {session.latestActivity.deviceType}
          </div>
        ))}
        <div className="flex px-6 justify-center items-center h-screen">
          <EmptyState
            title="Create New Business"
            description="
           Create a new business to get started"
            icons={[FileText, Link, Files]}
            action={{
              label: 'New Business',
              onClick: () => console.log('Create form clicked'),
            }}
          />
        </div>
      </div>
    );
  }

  return <div>Not signed in</div>
}
