import { ForgetPasswordContextType } from '@/schemas/ForgetPasswordSchemas';
import { useSignIn } from '@clerk/nextjs';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import React, { createContext, useContext, useState } from 'react';

const ForgetPasswordContext = createContext<
  ForgetPasswordContextType | undefined
>(undefined);

export function ForgetPasswordProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [apiErrors, setApiErrors] = useState<Array<{ message: string }>>([]);
  const { signIn, isLoaded, setActive } = useSignIn();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [accountData, setAccountData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
  });

  const handleVerification = async (verificationCode: string) => {
    setLoading(true);
    setApiErrors([]);

    if (!isLoaded) {
      setLoading(false);
    }
    try {
      await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: verificationCode,
      });

      setAccountData({ ...accountData, verificationCode });
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setApiErrors(err.errors);
      }
      const errors = JSON.stringify(err);

      throw new Error(errors);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (newPassword: string) => {
    console.log(newPassword);
    setLoading(true);
    setApiErrors([]);
    if (!isLoaded) {
      setLoading(false);
    }
    try {
      const passwordReset = await signIn?.resetPassword({
        password: newPassword,
      });
      console.log(passwordReset);
      setAccountData({ ...accountData, newPassword });

      if (setActive) {
        setActive({ session: passwordReset?.createdSessionId });
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setApiErrors(err.errors);
      }
      const errors = JSON.stringify(err);
      console.log(errors);
      throw new Error(errors);
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationCode = async (email: string) => {
    setLoading(true);
    setApiErrors([]);

    if (!isLoaded) {
      setLoading(false);
    }

    try {
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });

      setHasInteracted(true);
      setAccountData({ ...accountData, email });
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setApiErrors(err.errors);
      }
      const errors = JSON.stringify(err);

      throw new Error(errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgetPasswordContext.Provider
      value={{
        loading,
        setLoading,
        showErrors,
        apiErrors,
        setShowErrors,
        setApiErrors,
        handlePasswordReset,
        handleVerification,
        handleSendVerificationCode,
        setDirection,
        direction,
        hasInteracted,
        setHasInteracted,
        step,
        setStep,
        accountData,
      }}
    >
      {children}
    </ForgetPasswordContext.Provider>
  );
}

export const useForgetPasswordContext = () => {
  const context = useContext(ForgetPasswordContext);
  if (!context) {
    throw new Error(
      'useForgetPasswordContext must be used within a ForgetPasswordProvider',
    );
  }
  return context;
};
