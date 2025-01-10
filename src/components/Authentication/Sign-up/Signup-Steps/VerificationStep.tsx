'use client';
import { motion } from 'framer-motion';
import FormInput from '@/components/ui/Forms/FormInput';
import { slideVariants } from '../SignUpAnimation';
import { StepProps } from '@/schemas/SignUpSchemas';
import CompactResendOTPTimer from '@/components/ui/Forms/ResendTimeOut';
import { useSignUpContext } from '@/contexts/AuthContexts/SignUpContext/SignUpContextProvider';

export function VerificationStep({
  register,
  errors,
  direction,
  apiErrors,
  clearErrors,
}: StepProps) {
  const { handleResendVerification } = useSignUpContext();
  const apiError: string | undefined =
    apiErrors && apiErrors[0] && apiErrors[0].code === 'form_identifier_exists'
      ? 'Email Already Exist'
      : apiErrors && apiErrors[0] && apiErrors[0].code === 'form_password_pwned'
      ? 'Password must be 8+ characters with uppercase, lowercase, number, and special character.'
      : apiErrors && apiErrors[0] && apiErrors[0].code === 'form_code_incorrect'
      ? 'invalid code'
      : apiErrors && apiErrors[0]
      ? 'There was an error creating your account'
      : '';
  return (
    <motion.div
      key="step3"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col gap-6 max-sm:gap-5 relative justify-center items-center w-full"
    >
      <div className="w-full">
        <FormInput
          label="Verification Code"
          input="verificationCode"
          placeholder="Enter 6-digit code"
          type="text"
          register={register}
          error={errors.verificationCode || apiError}
        />

        <CompactResendOTPTimer
          onResend={async () => {
            if (clearErrors) clearErrors();   
            await handleResendVerification();
          }}
        />
      </div>
    </motion.div>
  );
}
