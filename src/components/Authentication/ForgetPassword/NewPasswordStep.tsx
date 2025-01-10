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

export default function NewPasswordStep({
  onBack,
  hasInteracted,
  direction,
}: {
  onBack: () => void;
  hasInteracted: boolean;
  direction: number;
}) {
  const { handlePasswordReset, loading, apiErrors } =
    useForgetPasswordContext();

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<{ Password: string; confirmPassword: string }>({
    resolver: zodResolver(
      forgetPasswordSchema.pick({ Password: true, confirmPassword: true }),
    ),
    mode: 'onSubmit',
  });

  const onSubmit = async (data: {
    Password: string;
    confirmPassword: string;
  }) => {
    if (data.Password !== data.confirmPassword) {
      setError('confirmPassword', {
        message: 'Passwords do not match',
      });

      return;
    }

    try {
      await handlePasswordReset(data.Password);
      clearErrors();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      key="step2"
      custom={direction}
      variants={hasInteracted ? slideVariants : initialVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex justify-center items-center w-full"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 max-sm:gap-5 relative justify-center items-center w-full"
      >
        <FormInput
          label="New Password"
          input="Password"
          placeholder="Enter your new password"
          type="password"
          register={register}
          error={errors.Password?.message || apiErrors[0]?.message}
        />
        <FormInput
          label="Confirm Password"
          input="confirmPassword"
          placeholder="Confirm your new password"
          type="password"
          register={register}
          error={errors.confirmPassword?.message || apiErrors[0]?.message}
        />
        <div className="absolute top-[-20px] right-0">
          <button
            type="button"
            onClick={() => {
              clearErrors();
              onBack();
            }}
            className="h-7 w-7 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center group/button"
          >
            <IconArrowLeft className="h-5 w-5 text-black dark:text-neutral-400 group-hover/button:rotate-[-12deg] transition-transform duration-300" />
          </button>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="px-[20px] rounded-[12px] py-[16px] max-md:px-[16px] text-[16px] max-md:text-[14px] max-md:py-[14px] w-full h-[56px] max-sm:h-[48px] my-[32px] font-semibold"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
          {loading && (
            <Loader2 className="ml-2 animate-spin" width={20} height={20} />
          )}
        </Button>
      </form>
    </motion.div>
  );
}
