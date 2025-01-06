'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Greetings from '../Geetings/Geetings';
import { usePathname } from 'next/navigation';


export default function AuthTransition({ children }: { children: React.ReactNode }) {
  const params = usePathname();
  const [showGreeting, setShowGreeting] = useState(params == '/sign-up');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 7000); // 5 seconds total (3 seconds for typing + 2 seconds display)

    return () => clearTimeout(timer);
  }, []);

  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    in: {
      opacity: 1,
      scale: 1,
    },
    out: {
      opacity: 0,
      scale: 1.2,
    },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <div key={params} className="w-full h-full flex items-center justify-center  overflow-hidden ">
      <AnimatePresence mode="wait">
        {showGreeting ? (
          <motion.div
            key="greeting"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Greetings />
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial="initial"
            animate="in"
            variants={pageVariants}
            transition={pageTransition}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
