import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type AuthSelectOption = {
  value: string;
  label: string;
};

type AuthSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: AuthSelectOption[];
  placeholder?: string;
  "aria-invalid"?: boolean;
  "aria-label"?: string;
  className?: string;
};

/**
 * Auth select matching Figma inputs (52px, 12px radius, chevron).
 */
export function AuthSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  className,
  ...props
}: AuthSelectProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-[52px] w-full appearance-none rounded-xl border border-neutral-300 bg-white pe-10 ps-4 text-sm text-neutral-800 outline-none transition-colors",
          "focus-visible:border-brand-700",
          !value && "text-neutral-400",
          props["aria-invalid"] && "border-destructive",
        )}
        aria-invalid={props["aria-invalid"]}
        aria-label={props["aria-label"]}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        className="pointer-events-none absolute end-3 top-1/2 size-5 -translate-y-1/2 text-brand-800"
        aria-hidden
      />
    </div>
  );
}
