import React from 'react';
import { Separator } from '../separator';

export default function FormSeparator() {
  return (
    <div className=" w-full flex items-center justify-center">
      <div className="relative w-full my-8">
        <div className="absolute inset-0 flex items-center">
          <Separator className="dark:bg-[#fff]/10 bg-[#EDEDED] " />
        </div>
        <div className="relative flex justify-center text-sm ">
          <span className="px-4 bg-background text-[#111] dark:text-[#FFFFFF]/70">
            Or
          </span>
        </div>
      </div>
    </div>
  );
}
