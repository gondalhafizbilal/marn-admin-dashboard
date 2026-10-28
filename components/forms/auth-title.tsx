import { AuthLocaleSwitcher } from "@/components/navigation/auth-locale-switcher";
import { cn } from "@/lib/utils";

type AuthTitleProps = {
  children: React.ReactNode;
  className?: string;
  /** Optional subtitle under the title row */
  description?: React.ReactNode;
};

/**
 * Auth frame title row: heading + language switcher (Figma).
 */
export function AuthTitle({ children, className, description }: AuthTitleProps) {
  return (
    <div className={cn("flex w-full flex-col items-start gap-2 self-stretch", className)}>
      <div className="flex w-full items-center justify-between gap-3">
        <h1 className="text-xl font-semibold leading-[1.3] text-neutral-800">{children}</h1>
        <AuthLocaleSwitcher />
      </div>
      {description ? (
        <p className="text-sm leading-[1.3] text-neutral-400">{description}</p>
      ) : null}
    </div>
  );
}
