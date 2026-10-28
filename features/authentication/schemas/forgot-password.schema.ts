import { z } from "zod";

export const resetMethodSchema = z.object({
  method: z.enum(["whatsapp", "email"]),
});

export const otpSchema = z.object({
  code: z.string().length(4, "Enter the 4-digit code"),
});

export const requestPasswordResetSchema = z.object({
  emailAddress: z.string().trim().email("Enter a valid email address"),
});

export const newPasswordSchema = z
  .object({
    token: z.string().min(1, "Enter the reset token"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetMethod = z.infer<typeof resetMethodSchema>["method"];
export type OtpFormValues = z.infer<typeof otpSchema>;
export type RequestPasswordResetFormValues = z.infer<
  typeof requestPasswordResetSchema
>;
export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;
