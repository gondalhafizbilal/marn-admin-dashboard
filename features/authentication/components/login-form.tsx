"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  AuthField,
  AuthInput,
  AuthPasswordInput,
  AuthTitle,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useRouter } from "@/i18n/navigation";
import {
  loginSchema,
  newPasswordSchema,
  requestPasswordResetSchema,
  type LoginFormValues,
  type NewPasswordFormValues,
  type RequestPasswordResetFormValues,
} from "@/features/authentication/schemas";
import { AuthRepository, isAppApiError } from "@/services";
import { useAuthStore } from "@/store";

const DEFAULT_VALUES: LoginFormValues = {
  email: "",
  password: "",
  rememberMe: true,
};

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isResetRequested, setIsResetRequested] = useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const forgotPasswordForm = useForm<RequestPasswordResetFormValues>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: { emailAddress: "" },
  });

  const resetPasswordForm = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    try {
      const response = await AuthRepository.login({
        emailAddress: values.email.trim(),
        password: values.password,
      });

      const [firstName, ...lastNameParts] = (response.user.fullName ?? "").trim().split(/\s+/);
      const lastName = lastNameParts.join(" ");

      setSession({
        user: {
          id: response.user.id,
          email: response.user.emailAddress ?? response.user.email ?? values.email,
          firstName: firstName ?? "",
          lastName: lastName ?? "",
          role: response.user.role ?? "client",
          agencyId: response.user.agencyId,
          avatarUrl: response.user.avatarUrl,
        },
        accessToken: response.accessToken,
        refreshToken: response.refreshToken ?? null,
      });

      toast.success("Signed in successfully");
      router.push("/dashboard");
    } catch (error) {
      const message = isAppApiError(error)
        ? error.message
        : "Invalid email or password.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordResetRequest(values: RequestPasswordResetFormValues) {
    setIsSubmitting(true);
    try {
      await AuthRepository.requestPasswordReset({
        emailAddress: values.emailAddress.trim(),
      });

      setIsResetRequested(true);
      toast.success("Password reset instructions sent to your email.");
    } catch (error) {
      toast.error(
        isAppApiError(error)
          ? error.message
          : "Unable to send reset instructions.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordReset(values: NewPasswordFormValues) {
    setIsSubmitting(true);
    try {
      await AuthRepository.resetPassword({
        token: values.token.trim(),
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      toast.success("Password reset successfully.");
      setIsForgotPasswordOpen(false);
      setIsResetRequested(false);
      forgotPasswordForm.reset();
      resetPasswordForm.reset();
      router.push("/login");
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

  if (isForgotPasswordOpen) {
    return (
      <div className="flex w-full flex-col items-center gap-6">
        <AuthTitle description={isResetRequested ? "Enter the reset token and your new password." : "Enter your registered email to receive a reset link."}>
          {isResetRequested ? "Reset your password" : t("forgotPasswordTitle")}
        </AuthTitle>

        {!isResetRequested ? (
          <form
            onSubmit={forgotPasswordForm.handleSubmit(handlePasswordResetRequest)}
            className="flex w-full flex-col gap-6"
            noValidate
          >
            <AuthField
              label="Email address"
              htmlFor="forgot-email"
              error={forgotPasswordForm.formState.errors.emailAddress?.message}
            >
              <AuthInput
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                aria-invalid={Boolean(forgotPasswordForm.formState.errors.emailAddress)}
                {...forgotPasswordForm.register("emailAddress")}
              />
            </AuthField>

            <div className="flex w-full gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-[52px] flex-1 rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                onClick={() => {
                  setIsForgotPasswordOpen(false);
                  setIsResetRequested(false);
                  forgotPasswordForm.reset();
                }}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-[52px] flex-1 rounded-lg bg-primary text-lg font-normal text-primary-foreground hover:bg-brand-700"
              >
                {isSubmitting ? "Sending..." : "Send reset email"}
              </Button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={resetPasswordForm.handleSubmit(handlePasswordReset)}
            className="flex w-full flex-col gap-6"
            noValidate
          >
            <AuthField
              label="Reset token"
              htmlFor="reset-token"
              error={resetPasswordForm.formState.errors.token?.message}
            >
              <AuthInput
                id="reset-token"
                autoComplete="off"
                placeholder="Paste the token from your email"
                aria-invalid={Boolean(resetPasswordForm.formState.errors.token)}
                {...resetPasswordForm.register("token")}
              />
            </AuthField>

            <AuthField
              label="New password"
              htmlFor="reset-new-password"
              error={resetPasswordForm.formState.errors.newPassword?.message}
            >
              <AuthPasswordInput
                id="reset-new-password"
                autoComplete="new-password"
                placeholder={t("passwordPlaceholder")}
                aria-invalid={Boolean(resetPasswordForm.formState.errors.newPassword)}
                toggleLabelShow={t("showPassword")}
                toggleLabelHide={t("hidePassword")}
                {...resetPasswordForm.register("newPassword")}
              />
            </AuthField>

            <AuthField
              label="Confirm password"
              htmlFor="reset-confirm-password"
              error={resetPasswordForm.formState.errors.confirmPassword?.message}
            >
              <AuthPasswordInput
                id="reset-confirm-password"
                autoComplete="new-password"
                placeholder={t("passwordPlaceholder")}
                aria-invalid={Boolean(resetPasswordForm.formState.errors.confirmPassword)}
                toggleLabelShow={t("showPassword")}
                toggleLabelHide={t("hidePassword")}
                {...resetPasswordForm.register("confirmPassword")}
              />
            </AuthField>

            <div className="flex w-full gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-[52px] flex-1 rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                onClick={() => setIsResetRequested(false)}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-[52px] flex-1 rounded-lg bg-primary text-lg font-normal text-primary-foreground hover:bg-brand-700"
              >
                {isSubmitting ? "Updating..." : "Reset password"}
              </Button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={loginForm.handleSubmit(onSubmit)}
      className="flex w-full flex-col items-center gap-6"
      noValidate
    >
      <AuthTitle description={t("signInDescription")}>{t("welcomeBack")}</AuthTitle>

      <div className="flex w-full flex-col gap-4">
        <AuthField label={t("email")} htmlFor="email" error={loginForm.formState.errors.email?.message}>
          <AuthInput
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            aria-invalid={Boolean(loginForm.formState.errors.email)}
            {...loginForm.register("email")}
          />
        </AuthField>

        <AuthField
          label={t("password")}
          htmlFor="password"
          error={loginForm.formState.errors.password?.message}
        >
          <AuthPasswordInput
            id="password"
            autoComplete="current-password"
            placeholder={t("passwordPlaceholder")}
            aria-invalid={Boolean(loginForm.formState.errors.password)}
            toggleLabelShow={t("showPassword")}
            toggleLabelHide={t("hidePassword")}
            {...loginForm.register("password")}
          />
        </AuthField>

        <div className="flex w-full items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <Controller
              name="rememberMe"
              control={loginForm.control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  className="size-4 rounded-[4px] border-brand-700 data-checked:border-brand-700 data-checked:bg-brand-700"
                />
              )}
            />
            <span className="text-sm text-neutral-800">{t("rememberMe")}</span>
          </label>

          <button
            type="button"
            onClick={() => {
              setIsForgotPasswordOpen(true);
              setIsResetRequested(false);
              forgotPasswordForm.reset();
              resetPasswordForm.reset();
            }}
            className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-brand-700 hover:underline"
          >
            {t("forgotPasswordLink")}
          </button>
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-[52px] w-full rounded-lg bg-primary text-lg font-normal text-primary-foreground shadow-[0px_8px_8px_-4px_rgba(0,136,255,0.03),0px_20px_24px_-4px_rgba(0,136,255,0.08)] hover:bg-brand-700"
        >
          {isSubmitting ? t("signingIn") : t("signIn")}
        </Button>

        <p className="text-sm text-neutral-600">
          {t("noAccount")} {" "}
          <Link
            href="/signup"
            className="font-semibold text-primary underline-offset-4 transition-colors hover:text-brand-700 hover:underline"
          >
            {t("register")}
          </Link>
        </p>
      </div>
    </form>
  );
}
