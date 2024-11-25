import FormInput from '@/components/ui/Forms/FormInput';
import { slideVariants } from '../SignUpAnimation';
import { motion } from 'framer-motion';
import { StepProps } from '@/schemas/SignUpSchemas';

export function CredentialsStep({
  register,
  errors,
  apiErrors,
  direction,
}: StepProps) {
  const apiError: string | undefined =
    apiErrors && apiErrors[0] && apiErrors[0].code === 'form_identifier_exists'
      ? 'Email Already Exist'
      : apiErrors && apiErrors[0] && apiErrors[0].code === 'form_password_pwned'
      ? 'Password must be 8+ characters with uppercase, lowercase, number, and special character.'
      : apiErrors && apiErrors[0]
      ? 'There was an error creating your account'
      : '';
  return (
    <motion.div
      key="step2"
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
          label="Email"
          input="email"
          placeholder="eg. 0v2xj@example.com"
          type="email"
          register={register}
          error={errors.email}
        />
      </div>
      <div className="w-full">
        <FormInput
          label="Password"
          input="password"
          placeholder="eg. ********"
          type="password"
          register={register}
          error={errors.password || apiError}
        />
      </div>
    </motion.div>
  );
}
