// components/SignUpForm.tsx
'use client';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FormSeparator from '@/components/ui/Forms/FormSeparator';
import SocialSignUpButton from '@/components/ui/Forms/SocialSignUpButton';

import { SignUpFormValues, signUpSchema } from '@/schemas/SignUpSchemas';
import {
  SignUpProvider,
  useSignUpContext,
} from '@/contexts/AuthContexts/SignUpContext/SignUpContextProvider';
import { PersonalInfoStep } from './Signup-Steps/PersonalInfoStep';
import { CredentialsStep } from './Signup-Steps/CredentialsStep';
import { VerificationStep } from './Signup-Steps/VerificationStep';
import {  Loader2 } from 'lucide-react';

function SignUpFormContent() {
  const {
    step,
    direction,
    hasInteracted,
    verificationError,
    showErrors,
    setStep,
    setDirection,
    setHasInteracted,
    setShowErrors,
    handleCreateUser,
    handleVerification,
    apiErrors,
    loading
  } = useSignUpContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    clearErrors,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onSubmit',
  });

  const onSubmit = async (data: SignUpFormValues) => {
    if (step !== 3) return;
    try {
      await handleVerification(data.verificationCode);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeStep = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!hasInteracted) setHasInteracted(true);
    if (step === 1) {
      setShowErrors(true);
      const isValid = await trigger(['firstName', 'lastName', 'phoneNumber']);
      if (!isValid) return;
      setShowErrors(false);
      clearErrors();
      setDirection(1);
      setStep(2);
    } else if (step === 2) {
      setShowErrors(true);
      const isValid = await trigger(['email', 'password']);
      if (!isValid) return;
      setShowErrors(false);
      clearErrors();
      try {
        await handleCreateUser(getValues());
        setDirection(1);
        setStep(3);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleBackStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDirection(-1);
    setStep(step - 1);
    setShowErrors(false);
    clearErrors();
  };

  const getDisplayError = (fieldError?: string) => {
    return showErrors ? fieldError : undefined;
  };

  const displayErrors = Object.keys(errors).reduce(
    (acc, key) => ({
      ...acc,
      [key]: getDisplayError(errors[key as keyof SignUpFormValues]?.message),
    }),
    {} as Record<string, string | undefined>,
  );

  return (
    <div className="px-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex max-w-[436.062px] max-sm:max-w-[341px] justify-center flex-col items-center"
      >
        <div className="flex flex-col justify-center items-center text-center">
          <h2 className="text-[28px] max-md:text-[24px] mb-2">
            {step === 3 ? 'Verify Your Email' : 'Sign Up Account'}
          </h2>
          <p className="text-[16px] max-md:text-[14px] dark:text-[#ccc] text-[#4B4B4B]">
            {step === 3
              ? 'Enter the verification code sent to your email'
              : 'Enter your personal information to create your account'}
          </p>
        </div>

        {step !== 3 && (
          <>
            <div className="mt-[58px] max-md:mt-[40px] flex justify-center items-center gap-4">
              <SocialSignUpButton
                strategy="oauth_github"
                iconLight="/icons/githubLight.svg"
                icon="/icons/github.svg"
                title="Github"
              />
              <SocialSignUpButton
                strategy="oauth_google"
                icon="/icons/google.svg"
                title="Google"
                iconLight="/icons/google.svg"
              />
            </div>
            <FormSeparator />
          </>
        )}

        {/* Since step 3 hide the social buttons (which are mintaining the width) we need to add a div with the same width so this Div is just for ui purpose */}
        {step === 3 && (
          <div className="mt-[58px] max-md:mt-[40px] w-[436.062px] max-sm:w-[341px]"></div>
        )}

        <div className="w-full relative">
          {step > 1 && (
            <div className="absolute top-[-20px] right-0">
              <button
                onClick={handleBackStep}
                className="h-7 w-7 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center group/button"
              >
                <IconArrowLeft className="h-5 w-5 text-black dark:text-neutral-400 group-hover/button:rotate-[-12deg] transition-transform duration-300" />
              </button>
            </div>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <PersonalInfoStep
                register={register}
                errors={displayErrors}
                hasInteracted={hasInteracted}
                direction={direction}
                apiErrors={apiErrors}
              />
            )}
            {step === 2 && (
              <CredentialsStep
                register={register}
                errors={displayErrors}
                hasInteracted={hasInteracted}
                direction={direction}
                apiErrors={apiErrors}
              />
            )}
            {step === 3 && (
              <VerificationStep
                register={register}
                errors={{ verificationCode: verificationError }}
                hasInteracted={hasInteracted}
                direction={direction}
                apiErrors={apiErrors}
              />
            )}
          </AnimatePresence>
        </div>

        <Button
          onClick={step !== 3 ? handleChangeStep : undefined}
          type={step === 3 ? 'submit' : 'button'}
          disabled={loading}
          className="px-[20px] rounded-[12px] py-[16px] max-md:px-[16px] text-[16px] max-md:text-[14px] max-md:py-[14px] w-full h-[56px] max-sm:h-[48px] my-[32px] font-semibold"
        >
          {step === 1
            ? 'Continue'
            : step === 2
            ? 'Create Account'
            : 'Verify & Complete'}
          {loading && (
            <Loader2 className="ml-2 animate-spin" width={20} height={20} />
          )}
        </Button>
      </form>
      <Link href="/sign-in">
        <p className="text-[16px] text-center max-md:text-[14px] font-light dark:text-[#ccc] text-[#4B4B4B]">
          Already have an account?{' '}
          <span className="dark:text-white hover:text-black/60 dark:hover:text-white/90 transition-all duration-300 font-medium">
            Sign In
          </span>
        </p>
      </Link>
    </div>
  );
}

export default function SignUpForm() {
  return (
    <SignUpProvider>
      <SignUpFormContent />
    </SignUpProvider>
  );
}
