import React from 'react';
import { Input } from '../input';
import { Label } from '../label';
import { UseFormRegister } from 'react-hook-form';

/* eslint-disable @typescript-eslint/no-explicit-any */


interface FormInputProps {
  label: string;
  placeholder: string;
  input: string;
  type: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  register: UseFormRegister<any>;
  error?: string;
}

export default function FormInput({
  label,
  placeholder,
  input,
  type,
  register,
  error,
}: FormInputProps) {
  return (
    <div className="flex w-full flex-col gap-[10px] max-md:gap-2">
      <Label
        htmlFor={input}
        className="dark:text-[#fff] text-[16px] max-md:text-[14px] text-[#111111]"
      >
        {label}
      </Label>
      <Input
        id={input}
        placeholder={placeholder}
        type={type}
        className="px-[20px] rounded-[12px] py-[16px] max-md:px-[16px] max-md:py-[14px] w-full h-[56px] max-sm:h-[48px] dark:bg-[#fff]/10 bg-[#F5F5F5]"
        {...register(input)}
      />
      {error && <p className="dark:text-white/70 text-[#111] text-sm mt-2">{error}</p>}
    </div>
  );
}
