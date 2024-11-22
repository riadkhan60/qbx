'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

function calculateWidth(
  displayWidth: number,
  componentWidthPercentage: number,
) {
  const width = displayWidth * (componentWidthPercentage / 100);
  return Math.round(width);
}

export default function OnboardingCardBg() {
  const [displayWidth, setDisplayWidth] = useState(window.innerWidth);

  useEffect(() => {
    setDisplayWidth(window.innerWidth);
  }, []);

  return (
    <>
      <div className="absolute  top-0 left-0 w-full h-full overflow-hidden bg-background">
        <div className="w-full  overflow-hidden relative h-full dark:bg-black transition-all duration-300 ease-in-out ">
          <div className="absolute dark:bg-white bg-black  w-[150%] left-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out  h-[50%] blur-[140px] top-[-150px]"></div>
          <div
            style={{
              width: `${calculateWidth(displayWidth, 79.86)}px`,
              height: '400px',
            }}
            className={cn(
              'absolute bg-[#9909DD] rounded-[100%] blur-[285.34px] top-[100px] left-1/2 -translate-x-1/2',
            )}
          ></div>

          <div
            style={{
              width: `${calculateWidth(displayWidth, 64.38)}px`,
              height: '300px',
            }}
            className={cn(
              'absolute bg-[#8646EE] rounded-[100%] blur-[285.34px] top-[220px] left-1/2 -translate-x-1/2',
            )}
          ></div>

          <div
            style={{
              width: `${calculateWidth(displayWidth, 51.88)}px`,
              height: '300px',
            }}
            className={cn(
              'absolute bg-[#3F0B93] rounded-[100%] blur-[285.34px] top-[320px] left-1/2 -translate-x-1/2',
            )}
          ></div>

          <div
            style={{
              width: `${calculateWidth(displayWidth, 90.56)}px`,
              height: '700px',
            }}
            className={cn(
              'absolute dark:bg-[#000000] transition-all duration-300 ease-in-out bg-white rounded-[100%]  blur-[285.34px] top-[350px] left-1/2 -translate-x-1/2',
            )}
          ></div>
        </div>
      </div>
    </>
  );
}
