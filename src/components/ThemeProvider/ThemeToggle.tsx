'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'motion/react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="absolute top-4 right-4 z-50">
      <motion.div
        className="relative h-10 w-10 cursor-pointer rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-2 shadow-lg"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-white dark:bg-gray-900"
          initial={false}
          animate={{
            scale: theme === 'light' ? 0 : 1,
            opacity: theme === 'light' ? 0 : 1,
          }}
          transition={{ duration: 0.4, ease: 'anticipate' }}
        />
        <motion.div
          className="relative h-full w-full"
          initial={false}
          animate={{
            rotate: theme === 'light' ? 0 : 360,
          }}
          transition={{ duration: 0.6, ease: 'anticipate' }}
        >
          <Sun className="absolute h-full w-full text-brandColor2 transition-opacity duration-300 dark:opacity-0" />
          <Moon className="absolute h-full w-full text-[#DEDBF6] opacity-0 transition-opacity duration-300 dark:opacity-100" />
        </motion.div>
      </motion.div>
    </div>
  );
}
