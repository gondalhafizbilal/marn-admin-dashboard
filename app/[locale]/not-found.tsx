import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default async function LocaleNotFound() {
  const t = await getTranslations("common");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-lg text-muted-foreground">{t("pageNotFound")}</p>
      <Link href="/dashboard" className={cn(buttonVariants())}>
        {t("backToDashboard")}
      </Link>
    </div>
  );
}
