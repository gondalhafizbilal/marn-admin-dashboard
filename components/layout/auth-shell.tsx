import { MarnLogo } from "@/components/icons/marn-logo";

import { AuthBackgroundDecor } from "./auth-background-decor";

type AuthShellProps = {
  children: React.ReactNode;
};

/**
 * Auth shell from Figma (1440×900):
 * - Brand column: 780px
 * - Cream frame: 434px, top inset ~28px
 * - Right gutter: 226px
 * - Frame scrolls internally when content overflows (e.g. uploaded files)
 */
export function AuthShell({ children }: AuthShellProps) {
  return (
    <div
      className="relative flex min-h-dvh w-full flex-col overflow-x-hidden lg:h-dvh lg:overflow-hidden lg:flex-row"
      style={{ background: "var(--auth-gradient), var(--brand-900)" }}
    >
      <AuthBackgroundDecor />

      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-8 min-[1440px]:w-[780px] min-[1440px]:shrink-0 min-[1440px]:flex-none lg:py-0">
        <MarnLogo className="w-[min(100%,200px)] lg:w-[min(100%,247px)]" />
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-6 lg:justify-end lg:py-7 lg:pe-16 min-[1440px]:pe-[226px]">
        <div className="flex max-h-[calc(100dvh-2rem)] w-full max-w-[434px] overflow-y-auto overscroll-contain rounded-2xl bg-auth-panel px-6 py-7 sm:px-[52px] lg:max-h-[calc(100dvh-3.5rem)] lg:rounded-[25px]">
          <div className="mx-auto flex min-h-full w-full max-w-[329px] flex-col justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
