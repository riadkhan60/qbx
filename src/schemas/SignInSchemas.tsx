import { ClerkAPIError } from "@clerk/types";
import { z } from "zod";



export type SignInContextType = {
  loading: boolean;
  showErrors: boolean;
  apiErrors?: ClerkAPIError[];
  hasInteracted: boolean;
  setShowErrors: (show: boolean) => void;
  setHasInteracted: (value: boolean) => void;
  handleSignIn: (email: string, password: string) => Promise<void>;
};

export const signInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignInFormValues = z.infer<typeof signInSchema>;