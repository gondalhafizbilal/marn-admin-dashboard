"use client";

import { CheckIcon, ChevronDownIcon, LanguagesIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, LOCALE_NAMES, type Locale } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  className?: string;
  triggerClassName?: string;
  variant?: "icon" | "button";
};

export function LocaleSwitcher({
  className,
  triggerClassName,
  variant = "icon",
}: LocaleSwitcherProps) {
  const t = useTranslations("locale");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function handleLocaleChange(nextLocale: Locale) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          variant === "icon"
            ? buttonVariants({ variant: "ghost", size: "icon" })
            : "inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50",
          triggerClassName,
        )}
        aria-label={t("label")}
      >
        {variant === "icon" ? (
          <LanguagesIcon className="size-4" />
        ) : (
          <>
            <span>{LOCALE_NAMES[locale]}</span>
            <ChevronDownIcon className="size-4" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn("w-40 rounded-2xl p-1.5", className)}>
        {LOCALES.map((item) => (
          <DropdownMenuItem
            key={item}
            onClick={() => handleLocaleChange(item)}
            className={cn(
              "flex items-center justify-between rounded-xl px-3 py-2 text-sm",
              item === locale ? "bg-accent" : undefined,
            )}
          >
            {LOCALE_NAMES[item]}
            {item === locale ? <CheckIcon className="size-4" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
