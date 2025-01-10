import { ClerkAPIError } from "@clerk/types";
import { UseFormRegister } from "react-hook-form";
import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  verificationCode: z.string().length(6, 'Verification code must be 6 digits'),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export interface SignUpContextType {
  step: number;
  direction: number;
  hasInteracted: boolean;
  verificationError: string;
  showErrors: boolean;
  setStep: (step: number) => void;
  setDirection: (direction: number) => void;
  setHasInteracted: (hasInteracted: boolean) => void;
  setVerificationError: (error: string) => void;
  setShowErrors: (show: boolean) => void;
  handleResendVerification: () => Promise<void>;
  handleCreateUser: (data: Partial<SignUpFormValues>) => Promise<void>;
  handleVerification: (code: string) => Promise<void>;
  apiErrors?: ClerkAPIError[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export interface FormInputProps {
  label: string;
  input: string;
  placeholder: string;
  type: string;
  register: UseFormRegister<SignUpFormValues>; // Replace with proper type from react-hook-form if needed
  error?: string;
}

export interface SocialSignButtonProps {
  icon: string;
  iconLight: string;
  title: string;
}

export interface StepProps {
  register: UseFormRegister<SignUpFormValues>;
  errors: Record<string, string | undefined>;
  hasInteracted: boolean;
  direction: number;
  apiErrors?: ClerkAPIError[];
  clearErrors?: () => void;
}