'use client';
import { useUser } from "@clerk/nextjs";
import { createContext, useEffect } from "react";

const UserContext = createContext({});


import React from 'react'



export default function UserContextProvoder({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    async function fetchUser() {
      if (isLoaded) {

        console.log(user);
        
        const userSessions = await user?.getSessions();

        console.log(userSessions);
      }
    }
    fetchUser();
  },[user, isLoaded]);
  return (
    <UserContext.Provider value={{}}>
     {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context
}