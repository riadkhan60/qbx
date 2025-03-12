'use client';
import { useUser } from '@clerk/nextjs';
import { createContext, useEffect, useState } from 'react';
import React from 'react';

const UserContext = createContext({});

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function syncUser() {
      if (isLoaded && user) {
        try {
          const response = await fetch('/api/sync-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) {
            throw new Error('Failed to sync user');
          }

          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      }
    }
    syncUser();
  }, [user, isLoaded]);

  return (
    <UserContext.Provider value={{ userData }}>{children}</UserContext.Provider>
  );
}

export const useUserContext = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};
