import * as z from 'zod';

export const forgetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  verificationCode: z.string().length(6, 'Verification code must be 6 digits'),
  Password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^a-zA-Z0-9]/,
      'Password must contain at least one special character',
  ),
  confirmPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

export type ForgetPasswordFormValues = z.infer<typeof forgetPasswordSchema>;

export type accountData = {
  email: string;
  verificationCode: string;
  newPassword: string;
};

export interface ForgetPasswordContextType {
  loading: boolean;
  showErrors: boolean;
  apiErrors: Array<{ message: string }>;
  setShowErrors: (show: boolean) => void;
  setApiErrors: (errors: Array<{ message: string }>) => void;
  handleSendVerificationCode: (email: string) => Promise<Error | void>;
  handleVerification: (verificationCode: string) => Promise<Error | void>;
  handlePasswordReset: (
    newPassword: string,
  ) => Promise<Error | void>;
  step: number;
  direction: number;
  hasInteracted: boolean;
  setLoading: (loading: boolean) => void;
  setStep: (step: number) => void;
  setDirection: (direction: number) => void;
  setHasInteracted: (hasInteracted: boolean) => void;
  accountData: accountData;
}
