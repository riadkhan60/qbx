'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, } from 'framer-motion';
import { Loader2, SendHorizontal,  } from 'lucide-react';

interface ResendOTPTimerProps {
  onResend: () => Promise<void>;
  initialTime?: number;
}

const CompactResendOTPTimer: React.FC<ResendOTPTimerProps> = ({
  onResend,
  initialTime = 10,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResend = async () => {
    try {
      
      setIsResending(true);
      await onResend();
      setIsResending(false);
      setTimeLeft(initialTime);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="inline-flex items-center gap-1 mt-4 text-[15px]">
      <AnimatePresence mode="wait">
        {timeLeft > 0 ? (
          <motion.div
            key="timer-group"
            className="inline-flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <span className="dark:text-gray-200 text-gray-700">
              Resend available in
            </span>
            <motion.div
              className="flex items-center justify-center  text-sm font-medium dark:text-gray-200 text-gray-700"
              key={timeLeft}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              {timeLeft}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="button-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              onClick={handleResend}
              disabled={isResending}
              className="dark:text-gray-200 text-gray-700 "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isResending ? (
                <span className="flex items-center gap-1">
                  Resending <Loader2 className="w-4 h-4 animate-spin" />
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  Resend <SendHorizontal size={15} />
                </span>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompactResendOTPTimer;
