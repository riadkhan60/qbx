import React, { createContext, useContext, useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { SignUpContextType, SignUpFormValues } from '@/schemas/SignUpSchemas';
import { ClerkAPIError } from '@clerk/types';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';

const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

export function SignUpProvider({ children }: { children: React.ReactNode }) {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [apiErrors, setApiErrors] = useState<ClerkAPIError[]>();
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async (data: Partial<SignUpFormValues>) => {
    if (!isLoaded) return;
    setLoading(true);
    setApiErrors(undefined);
    try {
      const user = await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      console.log(user);

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setApiErrors(err.errors);
      }
      const errors = JSON.stringify(err);
      throw errors;
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (code: string) => {
    if (!isLoaded) return;
    setApiErrors(undefined);
    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status !== 'complete') {
        throw new Error('Something went wrong. Please try again.');
      }

      await setActive({ session: completeSignUp.createdSessionId });
      console.log('Successfully verified and signed up!');
      redirect('/');
    } catch (err) {
        if (isClerkAPIResponseError(err)) {
          setApiErrors(err.errors);
        }
        const errors = JSON.stringify(err);
        throw errors;
    } finally {
      setLoading(false);
    }
  };

  
  const value = {
    step,
    direction,
    hasInteracted,
    verificationError,
    showErrors,
    setStep,
    setDirection,
    setHasInteracted,
    setVerificationError,
    setShowErrors,
    handleCreateUser,
    handleVerification,
    apiErrors,
    loading,
    setLoading,
  };
  
  return (
    <SignUpContext.Provider value={value}>{children}</SignUpContext.Provider>
  );
}

export function useSignUpContext() {
  const context = useContext(SignUpContext);
  if (context === undefined) {
    throw new Error('useSignUpContext must be used within a SignUpProvider');
  }
  return context;
}
