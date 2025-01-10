import React from 'react';
import { Label } from '@/components/ui/label';
import { Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import { FormPhoneInputProps } from '@/schemas/SignUpSchemas';
import 'react-phone-number-input/style.css';

export default function PhoneFormInput({
  label,
  placeholder,
  name,
  control,
  error,
  defaultCountry = 'US',
  onChange,
}: FormPhoneInputProps) {
  return (
    <div className="flex w-full flex-col gap-[10px] max-md:gap-2">
      <Label
        htmlFor={name}
        className="dark:text-[#fff] text-[16px] max-md:text-[14px] text-[#111111]"
      >
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange: fieldOnChange, value } }) => (
          <PhoneInput
            defaultCountry={defaultCountry}
            id={name}
            placeholder={placeholder}
            value={value}
            onChange={(newValue) => {
              fieldOnChange(newValue);
              onChange?.(newValue);
            }}
            className="px-[20px] rounded-[12px] py-[16px] max-md:px-[16px] max-md:py-[14px] w-full h-[56px] max-sm:h-[48px] dark:bg-[#fff]/10 bg-[#F5F5F5]"
          />
        )}
      />
      {error && (
        <p className="dark:text-white/70 text-[#111] text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
