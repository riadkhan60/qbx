'use client';

import { useUser } from '@clerk/nextjs';
import { create } from 'zustand';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

const client = new QueryClient();

// Zustand store
type UserState = {
  accountId: string;
  setAccountId: (id: string) => void;
};

const useUserStore = create<UserState>((set) => ({
  accountId: '',
  setAccountId: (id) => set({ accountId: id }),
}));

// Function to fetch user data
const fetchUser = async () => {
  const response = await axios.post(
    '/api/sync-user',
    {},
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );

  return response.data.id; // Extract the ID from the response
};

function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { setAccountId } = useUserStore();

  const { data, error } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    enabled: isLoaded && !!user, // Runs only when user is loaded
  });

  // Use useEffect to update Zustand store when data changes
  useEffect(() => {
    if (data) setAccountId(data);
  }, [data, setAccountId]);

  if (error) console.error('Error syncing user:', error);

  return <>{children}</>;
}

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={client}>
      <UserProvider>{children}</UserProvider>
    </QueryClientProvider>
  );
}

// Custom hook to access Zustand store
export const useUserContext = () => useUserStore();
