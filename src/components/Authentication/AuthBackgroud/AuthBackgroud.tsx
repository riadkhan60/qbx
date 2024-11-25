'use client';
import { ThemeToggle } from '@/components/ThemeProvider/ThemeToggle';
import OnboadringCardBg from '../OnBoardingCard/OnboadringCardBg';
import OnBoardingCard from '../OnBoardingCard/OnBoardingCard';
import AuthTransition from './AuthTransition';

export default function AuthBackgroud({
  children,
}: {
  children: React.ReactNode;
  }) {
  
  return (
    <main className="relative flex w-full h-dvh">
      <div className="w-[50%] max-lg:hidden relative h-full overflow-hidden">
        <div className="relative overflow-hidden w-full h-full z-30">
          <OnBoardingCard />
        </div>
        <OnboadringCardBg />
      </div>
      <ThemeToggle />
      <div className="w-[50%] h-full max-lg:w-full">
        <div className="w-full h-full flex items-center justify-center">
          <AuthTransition >
            {children}
          </AuthTransition>
        </div>
      </div>
    </main>
  );
}
