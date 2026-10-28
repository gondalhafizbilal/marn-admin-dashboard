"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  AuthField,
  AuthInput,
  AuthPasswordInput,
  AuthTitle,
} from "@/components/forms";
import { AuthLocaleSwitcher } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import {
  newPasswordSchema,
  requestPasswordResetSchema,
  type NewPasswordFormValues,
  type RequestPasswordResetFormValues,
} from "@/features/authentication/schemas";
import { useRouter } from "@/i18n/navigation";
import { AuthRepository, isAppApiError } from "@/services";

import { PasswordSuccessIcon } from "./password-success-icon";

type ForgotPasswordStep = "request" | "password" | "success";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [step, setStep] = useState<ForgotPasswordStep>("request");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestForm = useForm<RequestPasswordResetFormValues>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: { emailAddress: "" },
  });

  const passwordForm = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function handleRequestSubmit(values: RequestPasswordResetFormValues) {
    setIsSubmitting(true);
    try {
      await AuthRepository.requestPasswordReset({
        emailAddress: values.emailAddress.trim(),
      });

      setStep("password");
      toast.success("Password reset instructions sent to your email.");
    } catch (error) {
      toast.error(
        isAppApiError(error)
          ? error.message
          : "Unable to send password reset instructions.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordSubmit(values: NewPasswordFormValues) {
    setIsSubmitting(true);
    try {
      await AuthRepository.resetPassword({
        token: values.token.trim(),
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      setStep("success");
      toast.success("Password reset successfully.");
    } catch (error) {
      toast.error(
        isAppApiError(error)
          ? error.message
          : "Unable to reset your password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "request") {
    return (
      <form
        onSubmit={requestForm.handleSubmit(handleRequestSubmit)}
        className="flex w-full flex-col items-center gap-8"
        noValidate
      >
        <div className="flex w-full justify-end">
          <AuthLocaleSwitcher />
        </div>

        <AuthTitle description={t("forgotPasswordDescription")}>
          {t("forgotPasswordTitle")}
        </AuthTitle>

        <div className="flex w-full flex-col gap-4">
          <AuthField
            label="Email address"
            htmlFor="request-email"
            error={requestForm.formState.errors.emailAddress?.message}
          >
            <AuthInput
              id="request-email"
              type="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              aria-invalid={Boolean(requestForm.formState.errors.emailAddress)}
              {...requestForm.register("emailAddress")}
            />
          </AuthField>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-[52px] w-full rounded-lg bg-primary text-lg font-normal text-primary-foreground hover:bg-brand-700"
        >
          {isSubmitting ? "Sending..." : "Send reset email"}
        </Button>
      </form>
    );
  }

  if (step === "password") {
    return (
      <form
        onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
        className="flex w-full flex-col items-start gap-8"
        noValidate
      >
        <AuthTitle description={t("createNewPasswordDescription")}>
          {t("createNewPassword")}
        </AuthTitle>

        <div className="flex w-full flex-col gap-4">
          <AuthField
            label="Reset token"
            htmlFor="reset-token"
            error={passwordForm.formState.errors.token?.message}
          >
            <AuthInput
              id="reset-token"
              autoComplete="off"
              placeholder="Paste the token from the email"
              aria-invalid={Boolean(passwordForm.formState.errors.token)}
              {...passwordForm.register("token")}
            />
          </AuthField>

          <AuthField
            label={t("newPassword")}
            htmlFor="new-password"
            error={passwordForm.formState.errors.newPassword?.message}
          >
            <AuthPasswordInput
              id="new-password"
              autoComplete="new-password"
              placeholder={t("passwordPlaceholder")}
              toggleLabelShow={t("showPassword")}
              toggleLabelHide={t("hidePassword")}
              aria-invalid={Boolean(passwordForm.formState.errors.newPassword)}
              {...passwordForm.register("newPassword")}
            />
          </AuthField>

          <AuthField
            label={t("confirmPassword")}
            htmlFor="confirm-password"
            error={passwordForm.formState.errors.confirmPassword?.message}
          >
            <AuthPasswordInput
              id="confirm-password"
              autoComplete="new-password"
              placeholder={t("passwordPlaceholder")}
              toggleLabelShow={t("showPassword")}
              toggleLabelHide={t("hidePassword")}
              aria-invalid={Boolean(passwordForm.formState.errors.confirmPassword)}
              {...passwordForm.register("confirmPassword")}
            />
          </AuthField>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-[52px] w-full rounded-lg bg-primary text-lg font-normal text-primary-foreground hover:bg-brand-700"
        >
          {isSubmitting ? t("savingPassword") : t("savePassword")}
        </Button>
      </form>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-[42px]">
      <div className="flex w-full justify-end">
        <AuthLocaleSwitcher />
      </div>
      <PasswordSuccessIcon />

      <div className="flex w-full max-w-[290px] flex-col items-center gap-4 text-center">
        <h1 className="text-xl font-semibold leading-[1.3] text-neutral-800">
          {t("passwordSuccessTitle")}
        </h1>
        <p className="text-sm leading-[1.3] text-neutral-400">
          {t("passwordSuccessDescription")}
        </p>
      </div>

      <Button
        type="button"
        onClick={() => router.push("/login")}
        className="h-[52px] w-full rounded-lg bg-primary text-lg font-normal text-primary-foreground shadow-[0px_8px_8px_-4px_rgba(161,29,58,0.03),0px_20px_24px_-4px_rgba(161,29,58,0.08)] hover:bg-brand-700"
      >
        {t("logInAgain")}
      </Button>
    </div>
  );
}
