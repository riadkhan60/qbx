'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Greetings() {
  const [text, setText] = useState('');
  const fullText = 'Get Started With Us';
  const [subText, setSubText] = useState('');
  const fullSubText =
    'Embark on your next extraordinary journey with Qbexel';

  useEffect(() => {
    const typeText = async () => {
      for (let i = 0; i <= fullText.length; i++) {
        setText(fullText.slice(0, i));
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      for (let i = 0; i <= fullSubText.length; i++) {
        setSubText(fullSubText.slice(0, i));
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    };
    typeText();
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.2, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex w-full h-full flex-col items-center justify-center px-2"
    >
      <motion.div
        className="flex justify-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Image
          className="dark:hidden"
          src="/images/logos/qbexel.svg"
          width={100}
          height={100}
          alt="logo"
        />
        <Image
          className="hidden dark:block"
          src="/images/logos/qbexeldark.svg"
          width={100}
          height={100}
          alt="logo"
        />
      </motion.div>
      <motion.div
        className="mt-[25px] mb-[25px] flex flex-col text-center justify-center items-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <motion.h2
          className="text-[40px] font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {text}
        </motion.h2>
        <motion.p
          className="mt-[4px] text-[20px] max-w-[428.359px] text-[#333333] dark:text-[#cccc]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {subText}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
