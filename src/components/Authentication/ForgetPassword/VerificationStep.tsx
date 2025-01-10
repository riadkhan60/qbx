import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgetPasswordSchema } from '@/schemas/ForgetPasswordSchemas';
import { useForgetPasswordContext } from '@/contexts/AuthContexts/ForgetPassword/ForgetPasswordProvider';
import FormInput from '@/components/ui/Forms/FormInput';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { IconArrowLeft } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { initialVariants, slideVariants } from '../Sign-up/SignUpAnimation';
import CompactResendOTPTimer from '@/components/ui/Forms/ResendTimeOut';

export default function VerificationStep({
  onNext,
  onBack,
  hasInteracted,
  direction,
}: {
  onNext: () => void;
  onBack: () => void;
  hasInteracted: boolean;
  direction: number;
}) {
  const { handleVerification, loading, apiErrors, handleSendVerificationCode, accountData} = useForgetPasswordContext();

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<{ verificationCode: string }>({
    resolver: zodResolver(
      forgetPasswordSchema.pick({ verificationCode: true }),
    ),
    mode: 'onSubmit',
  });

  const onSubmit = async (data: { verificationCode: string }) => {
    try {
      await handleVerification(data.verificationCode);
      clearErrors();
      onNext();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      key="step1"
      custom={direction}
      variants={hasInteracted ? slideVariants : initialVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex justify-center items-center w-full"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full relative">
        <FormInput
          label="Verification Code"
          input="verificationCode"
          placeholder="Enter the verification code"
          type="text"
          register={register}
          error={errors.verificationCode?.message || apiErrors[0]?.message === 'is incorrect' ? 'Invalid code, try Again' : apiErrors[0]?.message}
        />
        <div className="absolute top-[-20px] right-0">
          <button
            type="button"
            onClick={() => {
              clearErrors();
              onBack()
            }}
            className="h-7 w-7 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center group/button"
          >
            <IconArrowLeft className="h-5 w-5 text-black dark:text-neutral-400 group-hover/button:rotate-[-12deg] transition-transform duration-300" />
          </button>
        </div>
        <CompactResendOTPTimer onResend={async () => {
          clearErrors();
          await handleSendVerificationCode(accountData.email);
        }} />
        <Button
          type="submit"
          disabled={loading}
          className="px-[20px] rounded-[12px] py-[16px] max-md:px-[16px] text-[16px] max-md:text-[14px] max-md:py-[14px] w-full h-[56px] max-sm:h-[48px] my-[32px] font-semibold"
        >
          {loading ? 'Verifying...' : 'Verify'}
          {loading && (
            <Loader2 className="ml-2 animate-spin" width={20} height={20} />
          )}
        </Button>
      </form>
    </motion.div>
  );
}
