import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forgetPasswordSchema,
  ForgetPasswordFormValues,
} from '@/schemas/ForgetPasswordSchemas';
import { useForgetPasswordContext } from '@/contexts/AuthContexts/ForgetPassword/ForgetPasswordProvider';
import FormInput from '@/components/ui/Forms/FormInput';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { initialVariants, slideVariants } from '../Sign-up/SignUpAnimation';

const EmailStep: React.FC<{
  onNext: () => void;
  direction: number;
  hasInteracted: boolean;
}> = ({ onNext, direction, hasInteracted }) => {
  const { handleSendVerificationCode, loading, apiErrors } =
    useForgetPasswordContext();

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<ForgetPasswordFormValues>({
    resolver: zodResolver(forgetPasswordSchema.pick({ email: true })),
    mode: 'onSubmit',
  });

  const onSubmit = async (data: ForgetPasswordFormValues) => {
    try {
      await handleSendVerificationCode(data.email);
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
      className="flex flex-col gap-6 max-sm:gap-5 justify-center items-center w-full"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full relative">
        <FormInput
          label="Email"
          input="email"
          placeholder="Enter your email"
          type="email"
          register={register}
          error={errors.email?.message || apiErrors[0]?.message}
        />

        <Button
          type="submit"
          disabled={loading}
          className="px-[20px] rounded-[12px] py-[16px] max-md:px-[16px] text-[16px] max-md:text-[14px] max-md:py-[14px] w-full h-[56px] max-sm:h-[48px] my-[32px] font-semibold"
        >
          Find Account
          {loading && (
            <Loader2 className="ml-2 animate-spin" width={20} height={20} />
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default EmailStep;
