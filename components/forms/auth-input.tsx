import { cn } from "@/lib/utils";

/**
 * Auth-styled text input matching Figma:
 * h-52px, radius 12px, white fill, neutral border, primary focus.
 */
export function AuthInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="auth-input"
      className={cn(
        "h-[52px] w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm text-neutral-800 outline-none transition-colors",
        "placeholder:text-neutral-400",
        "focus-visible:border-brand-700",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}
