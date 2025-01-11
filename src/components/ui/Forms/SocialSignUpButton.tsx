import Image from 'next/image';
import { OAuthStrategy } from '@clerk/types';
import useSocialSignUp from '@/hooks/useSocialSign';

export default function SocialSignUpButton({
  icon,
  title,
  iconLight,
  strategy,
}: {
  icon: string;
  title: string;
  iconLight?: string;
  strategy: 'oauth_github' | 'oauth_google';
}) {
  const { signUpWith, signInWith } = useSocialSignUp();

  const handleSignIn = async (strategy: OAuthStrategy) => {
    try {
      if (window.location.pathname.includes('sign-up')) {
        await signUpWith(strategy);
      } else {
        await signInWith(strategy);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <button
      type="button"
      className="group relative h-[56px] max-sm:h-[48px] w-full flex justify-center items-center gap-2 py-4 px-[64.5px] max-sm:px-[44.5px] max-sm:py-[14px] border-[1px] dark:border-[#fff]/20 border-[#EDEDED] rounded-[12px] transition-all duration-300 ease-out hover:scale-[1.0] hover:shadow-lg dark:hover:shadow-white/5 hover:border-transparent dark:hover:bg-[#0f0f0f]/40 hover:bg-gray-50 before:absolute before:inset-0 before:rounded-[12px] before:transition-all before:duration-300 hover:before:scale-[1.02] before:opacity-0 hover:before:opacity-100 before:bg-gradient-to-r before:from-gray-100/50 before:to-transparent dark:before:from-white/5 dark:before:to-transparent"
      onClick={(e) => {
        e.preventDefault();
        handleSignIn(strategy);
      }}
    >
      <div className="relative z-10 flex items-center gap-2">
        {iconLight && (
          <Image
            src={iconLight}
            width={2000}
            height={2000}
            className="dark:hidden w-5 h-5 transition-transform duration-300 group-hover:scale-110"
            alt={title}
          />
        )}
        <Image
          src={icon}
          width={2000}
          height={2000}
          alt={title}
          className="hidden w-5 h-5 dark:block transition-transform duration-300 group-hover:scale-110"
        />
        <span className="transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-white">
          {title}
        </span>
      </div>
    </button>
  );
}
