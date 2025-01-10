'use client';
import React, { useState } from 'react';
import {
  ForgetPasswordProvider,
  useForgetPasswordContext,
} from '@/contexts/AuthContexts/ForgetPassword/ForgetPasswordProvider';
import { motion, AnimatePresence } from 'framer-motion';
import EmailStep from './EmailStep';
import VerificationStep from './VerificationStep';
import NewPasswordStep from './NewPasswordStep';
import Link from 'next/link';

const steps = {
  EMAIL: 'email',
  VERIFICATION: 'verification',
  NEW_PASSWORD: 'new_password',
};

function ForgetPasswordContent() {
  const [currentStep, setCurrentStep] = useState(steps.EMAIL);
  const { setDirection, setShowErrors, direction, setApiErrors, hasInteracted} = useForgetPasswordContext();

  const nextStep = () => {
    if (currentStep === steps.EMAIL) {
      setCurrentStep(steps.VERIFICATION);
    } else if (currentStep === steps.VERIFICATION) {
      setCurrentStep(steps.NEW_PASSWORD);
    }
    setShowErrors(false);
    setApiErrors([]);
    setDirection(1);
  };

  const previousStep = () => {
    if (currentStep === steps.VERIFICATION) {
      setCurrentStep(steps.EMAIL);
    } else if (currentStep === steps.NEW_PASSWORD) {
      setCurrentStep(steps.VERIFICATION);
    }
    setShowErrors(false);
    setDirection(-1);
  };

  return (
    <div className="px-6">
      <div className="flex max-w-[436.062px] max-sm:max-w-[341px] justify-center flex-col items-center">
        <FormHeaderContent currentStep={currentStep} />
        <div className="w-[436.062px] max-sm:w-[341px]"></div>
        <div className="w-full mt-[58px] max-md:mt-[40px]">
          <div>
            <AnimatePresence mode="wait" custom={direction}>
              {currentStep === steps.EMAIL && (
                <EmailStep
                  hasInteracted={hasInteracted}
                  direction={direction}
                  onNext={nextStep}
                />
              )}
              {currentStep === steps.VERIFICATION && (
                <VerificationStep
                  onNext={nextStep}
                  hasInteracted={hasInteracted}
                  direction={direction}
                  onBack={previousStep}
                />
              )}
              {currentStep === steps.NEW_PASSWORD && (
                <NewPasswordStep
                  hasInteracted={hasInteracted}
                  direction={direction}
                  onBack={previousStep}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
        <div>
          <Link href="/sign-in">
            <p className="text-[16px] text-center max-md:text-[14px] font-light dark:text-[#ccc] text-[#4B4B4B]">
              Remember your password? &nbsp;
              <span className="dark:text-white hover:text-black/60 dark:hover:text-white/90 transition-all duration-300 font-medium">
                Sign In
              </span>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FormHeaderContent({ currentStep }: { currentStep: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        key={currentStep}
        className="flex flex-col justify-center items-center text-center"
      >
        <h2 className="text-[28px] max-md:text-[24px] mb-2">
          {currentStep === steps.EMAIL && 'Forgot Password'}
          {currentStep === steps.VERIFICATION && 'Verification'}
          {currentStep === steps.NEW_PASSWORD && 'New Password'}
        </h2>
        <p className="text-[16px] max-md:text-[14px] dark:text-[#ccc] text-[#4B4B4B]">
          {currentStep === steps.EMAIL &&
            'Enter your email address to receive a verification code'}
          {currentStep === steps.VERIFICATION &&
            'Enter the verification code sent to your email'}
          {currentStep === steps.NEW_PASSWORD && 'Enter your new password'}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ForgetPassword() {
  return (
    <ForgetPasswordProvider>
      <ForgetPasswordContent />
    </ForgetPasswordProvider>
  );
}
