"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  AuthField,
  AuthPasswordInput,
  AuthPhoneInput,
  AuthInput,
  AuthTitle,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { signupSchema, type SignupFormValues } from "@/features/authentication/schemas";
import { Link, useRouter } from "@/i18n/navigation";
import { AuthRepository, isAppApiError } from "@/services";
import { useAuthStore } from "@/store";

const DEFAULT_VALUES: SignupFormValues = {
  fullName: "",
  email: "",
  countryCode: "+974",
  phone: "",
  password: "",
  acceptTerms: false,
};

export function SignupForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const countryCode = watch("countryCode");

  async function onSubmit(values: SignupFormValues) {
    // Proceed without document upload requirement
    setIsSubmitting(true);

    try {
      const response = await AuthRepository.register({
        fullName: values.fullName.trim(),
        // Preserve leading '+' in country code — backend strips if needed.
        countryCode: values.countryCode.trim(),
        phoneNumber: values.phone.replace(/\s+/g, "").trim(),
        emailAddress: values.email.trim(),
        password: values.password,
      });

      const [firstName, ...lastNameParts] = (response.user.fullName ?? values.fullName).trim().split(/\s+/);
      const lastName = lastNameParts.join(" ");

      setSession({
        user: {
          id: response.user.id,
          email: response.user.emailAddress ?? response.user.email ?? values.email,
          firstName: firstName ?? values.fullName.trim(),
          lastName: lastName ?? "",
          role: response.user.role ?? "client",
          agencyId: response.user.agencyId,
          avatarUrl: response.user.avatarUrl,
        },
        accessToken: response.accessToken,
        refreshToken: response.refreshToken ?? null,
      });

      toast.success("Account created successfully");
      router.push("/dashboard");
    } catch (error) {
      const message = isAppApiError(error)
        ? error.message
        : "Unable to create your account right now.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col items-center gap-4 lg:gap-5"
      noValidate
    >
      <AuthTitle>{t("registerAccount")}</AuthTitle>

      <div className="flex w-full flex-col gap-3">
        <AuthField label={t("fullName")} htmlFor="signup-full-name" error={errors.fullName?.message}>
          <AuthInput
            id="signup-full-name"
            type="text"
            autoComplete="name"
            placeholder={t("fullNamePlaceholder")}
            aria-invalid={Boolean(errors.fullName)}
            {...register("fullName")}
          />
        </AuthField>

        <AuthField label={t("email")} htmlFor="signup-email" error={errors.email?.message}>
          <AuthInput
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </AuthField>

        <AuthField
          label={t("contactNumber")}
          htmlFor="signup-phone"
          error={errors.phone?.message}
        >
          <AuthPhoneInput
            countryCode={countryCode}
            onCountryCodeChange={(value) => setValue("countryCode", value)}
            countryCodeLabel={t("countryCode")}
            phoneProps={{
              id: "signup-phone",
              placeholder: t("phonePlaceholder"),
              "aria-invalid": Boolean(errors.phone),
              ...register("phone"),
            }}
          />
        </AuthField>

        <AuthField
          label={t("password")}
          htmlFor="signup-password"
          error={errors.password?.message}
        >
          <AuthPasswordInput
            id="signup-password"
            autoComplete="new-password"
            placeholder={t("passwordPlaceholder")}
            aria-invalid={Boolean(errors.password)}
            toggleLabelShow={t("showPassword")}
            toggleLabelHide={t("hidePassword")}
            {...register("password")}
          />
        </AuthField>

        <label className="flex w-full cursor-pointer items-center gap-2">
          <Controller
            name="acceptTerms"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                className="size-4 rounded-[4px] border-brand-700 data-checked:border-brand-700 data-checked:bg-brand-700"
              />
            )}
          />
          <span className="text-sm text-neutral-800">{t("agreeTerms")}</span>
        </label>
        {errors.acceptTerms ? (
          <p className="-mt-1 text-xs text-destructive">{errors.acceptTerms.message}</p>
        ) : null}
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-[48px] w-full rounded-lg bg-primary text-lg font-normal text-primary-foreground shadow-[0px_8px_8px_-4px_rgba(0,136,255,0.03),0px_20px_24px_-4px_rgba(0,136,255,0.08)] hover:bg-brand-700 lg:h-[52px]"
        >
          {isSubmitting ? t("registering") : t("signUp")}
        </Button>

        <p className="text-sm text-neutral-800">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="font-semibold text-primary hover:opacity-80">
            {t("signIn")}
          </Link>
        </p>
      </div>
    </form>
  );
}
