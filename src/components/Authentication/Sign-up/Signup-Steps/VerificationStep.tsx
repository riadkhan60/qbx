import {motion} from 'framer-motion';
import FormInput from '@/components/ui/Forms/FormInput';
import { slideVariants, } from '../SignUpAnimation';
import { StepProps } from '@/schemas/SignUpSchemas';

export function VerificationStep({ register, errors, direction }: StepProps) {
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
          error={errors.verificationCode}
        />
      </div>
    </motion.div>
  );
}
