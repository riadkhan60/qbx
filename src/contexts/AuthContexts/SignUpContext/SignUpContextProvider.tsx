import React, { createContext, useContext, useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { SignUpContextType, SignUpFormValues } from '@/schemas/SignUpSchemas';


const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

export function SignUpProvider({ children }: { children: React.ReactNode }) {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const handleCreateUser = async (data: Partial<SignUpFormValues>) => {
    if (!isLoaded) return;

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
      throw err;
    }
  };

  const handleVerification = async (code: string) => {
    if (!isLoaded) return;

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
      console.error(err);
      throw err;
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
