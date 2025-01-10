import React from 'react';
import { motion } from 'framer-motion';
import FormInput from '@/components/ui/Forms/FormInput';
import { slideVariants, initialVariants } from '../SignUpAnimation';
import { StepProps } from '@/schemas/SignUpSchemas';
import PhoneFormInput from '@/components/ui/Forms/FormPhoneInput';


export function PersonalInfoStep({
  register,
  errors,
  hasInteracted,
  direction,
  control
}: StepProps) {
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
      <div className="flex justify-between items-center gap-4">
        <FormInput
          label="First Name"
          input="firstName"
          placeholder="eg. John"
          type="text"
          register={register}
          error={errors.firstName}
        />
        <FormInput
          label="Last Name"
          input="lastName"
          placeholder="eg. Doe"
          type="text"
          register={register}
          error={errors.lastName}
        />
      </div>
      <div className="w-full">
        <PhoneFormInput
          name="phoneNumber"
          label="Phone Number"
          control={control}
          placeholder="(555) 123-4567"
          error={errors.phoneNumber}
        />
      </div>
    </motion.div>
  );
}
