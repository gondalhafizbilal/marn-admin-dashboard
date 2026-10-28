import { ChevronDownIcon } from "lucide-react";

import { AuthInput } from "@/components/forms/auth-input";
import { cn } from "@/lib/utils";

type AuthPhoneInputProps = {
  countryCode: string;
  onCountryCodeChange: (value: string) => void;
  phoneProps?: React.ComponentProps<"input">;
  countryCodeLabel?: string;
  className?: string;
};

const COUNTRY_CODES = [{ value: "+974", label: "+974" }] as const;

/**
 * Split phone field: country code (90px) + number input.
 */
export function AuthPhoneInput({
  countryCode,
  onCountryCodeChange,
  phoneProps,
  countryCodeLabel = "Country code",
  className,
}: AuthPhoneInputProps) {
  return (
    <div className={cn("flex w-full items-start gap-3", className)}>
      <div className="relative w-[90px] shrink-0">
        <select
          aria-label={countryCodeLabel}
          value={countryCode}
          onChange={(event) => onCountryCodeChange(event.target.value)}
          className="h-[52px] w-full appearance-none rounded-xl border border-neutral-300 bg-white pe-8 ps-3 text-sm text-neutral-800 outline-none focus-visible:border-brand-700"
        >
          {COUNTRY_CODES.map((code) => (
            <option key={code.value} value={code.value}>
              {code.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-brand-800"
          aria-hidden
        />
      </div>
      <AuthInput className="flex-1" inputMode="tel" {...phoneProps} />
    </div>
  );
}
