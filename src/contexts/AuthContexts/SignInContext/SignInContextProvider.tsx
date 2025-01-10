import React, { createContext, useContext, useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { SignInContextType } from '@/schemas/SignInSchemas';
import { ClerkAPIError } from '@clerk/types';



const SignInContext = createContext<SignInContextType | undefined>(undefined);

export function SignInProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [apiErrors, setApiErrors] = useState<ClerkAPIError[]>([]);

  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();

  const handleSignIn = async (email: string, password: string) => {
    if (!isLoaded) return;
    setLoading(true);
        try {
          const signInAttempt = await signIn.create({
            identifier: email,
            password,
          });

          // If sign-in process is complete, set the created session as active
          // and redirect the user
          if (signInAttempt.status === 'complete') {
            await setActive({ session: signInAttempt.createdSessionId });
            router.push('/');
          } else {
            // If the status is not complete, check why. User may need to
            // complete further steps.
            console.error(JSON.stringify(signInAttempt, null, 2));
          }
        } catch (err) {
          if (isClerkAPIResponseError(err)) {
            setApiErrors(err.errors || []);
          }
          const errors = JSON.stringify(err);
          throw errors;
        } finally {
          setLoading(false);
        }
  };

  return (
    <SignInContext.Provider
      value={{
        loading,
        showErrors,
        apiErrors,
        hasInteracted,
        setShowErrors,
        setHasInteracted,
        handleSignIn,
        setApiErrors,
      }}
    >
      {children}
    </SignInContext.Provider>
  );
}

export const useSignInContext = () => {
  const context = useContext(SignInContext);
  if (!context) {
    throw new Error('useSignInContext must be used within SignInProvider');
  }
  return context;
};
