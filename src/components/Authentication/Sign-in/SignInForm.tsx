'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FormSeparator from '@/components/ui/Forms/FormSeparator';
import SocialSignUpButton from '@/components/ui/Forms/SocialSignUpButton';
import { Loader2 } from 'lucide-react';
import {
  SignInProvider,
  useSignInContext,
} from '@/contexts/AuthContexts/SignInContext/SignInContextProvider';
import FormInput from '@/components/ui/Forms/FormInput';
import { SignInFormValues, signInSchema } from '@/schemas/SignInSchemas';

function SignInFormContent() {
  const { loading, showErrors, apiErrors, setShowErrors, handleSignIn } =
    useSignInContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onSubmit',
  });

  const onSubmit = async (data: SignInFormValues) => {
    setShowErrors(true);
    try {
      await handleSignIn(data.email, data.password);
    } catch (err) {
      console.error(err);
    }
  };

  const getDisplayError = (fieldError?: string) => {
    return showErrors ? fieldError : undefined;
  };

  const displayErrors = Object.keys(errors).reduce(
    (acc, key) => ({
      ...acc,
      [key]: getDisplayError(errors[key as keyof SignInFormValues]?.message),
    }),
    {} as Record<string, string | undefined>,
  );

  return (
    <div className="px-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex max-w-[436.062px] max-sm:w-[341px] justify-center flex-col items-center"
      >
        <div className="flex flex-col justify-center items-center text-center">
          <h2 className="text-[28px] max-md:text-[24px] mb-2">Sign In Account</h2>
          <p className="text-[16px] max-md:text-[14px] dark:text-[#ccc] text-[#4B4B4B]">
            Welcome back! Please enter your details to sign in.
          </p>
        </div>

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

        <div className="flex flex-col gap-6 max-sm:gap-5 relative justify-center items-center w-full">
          <div className=" w-full">
            <FormInput
              label="Email"
              input="email"
              placeholder="eg. 0v2xj@example.com"
              type="email"
              register={register}
              error={displayErrors.email}
            />
          </div>

          <div className="w-full">
            <FormInput
              label="Password"
              input="password"
              placeholder="Enter your password"
              type="password"
              register={register}
              error={displayErrors.password || apiErrors?.[0]?.message}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="px-[20px] rounded-[12px] py-[16px] max-md:px-[16px] text-[16px] max-md:text-[14px] max-md:py-[14px] w-full h-[56px] max-sm:h-[48px] my-[32px] font-semibold"
        >
          Sign In
          {loading && (
            <Loader2 className="ml-2 animate-spin" width={20} height={20} />
          )}
        </Button>
      </form>

      <Link href="/sign-up">
        <p className="text-[16px] text-center max-md:text-[14px] font-light dark:text-[#ccc] text-[#4B4B4B]">
          {"Don't"} have an account?{' '}
          <span className="dark:text-white hover:text-black/60 dark:hover:text-white/90 transition-all duration-300 font-medium">Sign Up</span>
        </p>
      </Link>
    </div>
  );
}

export default function SignInForm() {
  return (
    <SignInProvider>
      <SignInFormContent />
    </SignInProvider>
  );
}
