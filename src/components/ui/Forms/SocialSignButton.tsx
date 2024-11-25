import Image from 'next/image';
import React from 'react';

export default function SocialSignButton({
  icon,
  title,
  iconLight,
}: {
  icon: string;
  title: string;
  iconLight?: string;
}) {
  return (
    <button className=" h-[56px] max-sm:h-[48px] w-full flex justify-center items-center gap-2 py-4 px-[64.5px] max-sm:px-[44.5px] max-sm:py-[14px] border-[1px] dark:border-[#fff]/20  border-[#EDEDED] rounded-[12px]">
      {iconLight && (
        <Image
          src={iconLight}
          width={200}
          height={200}
          className="dark:hidden w-5 h-5"
          alt={title}
        />
      )}
      <Image
        src={icon}
        width={200}
        height={200}
        alt={title}
        className="hidden w-5 h-5 dark:block"
      />
      <span>{title}</span>
    </button>
  );
}
