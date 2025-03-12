'use client';

import { useSignIn, useSignUp } from '@clerk/nextjs';
import { OAuthStrategy } from '@clerk/types';

export default function useSocialSignUp() {
  const { signIn, isLoaded: LoadedSignIn } = useSignIn();
  const { signUp, isLoaded: LoadedSignUp } = useSignUp();

  const signInWith = async (strategy: OAuthStrategy) => {
    if (!LoadedSignIn) return;
    const signIN = await signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: '/callback',
      redirectUrlComplete: '/callback/sync-user', // Unified completion
    });
    console.log('signinnn', signIN); 
  };

  const signUpWith = (strategy: OAuthStrategy) => {
    if (!LoadedSignUp) return;
    return signUp.authenticateWithRedirect({
      strategy,
      redirectUrl: '/callback',
      redirectUrlComplete: '/callback/sync-user', // Unified completion
    });
  };

  return { signUpWith, signInWith };
}
