import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { AdminResourceConfig, AdminResourceField } from "@/constants/admin-resources";
import { getDirection, type Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AdminResourceAddViewProps = {
  config: AdminResourceConfig;
  listHref: string;
};

function FieldControl({ field }: { field: AdminResourceField }) {
  if (field.type === "textarea") {
    return (
      <textarea
        className="min-h-[120px] w-full rounded-[18px] border border-brand-800/15 bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-brand-700/50"
        placeholder={field.placeholder}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select className="h-11 w-full rounded-[18px] border border-brand-800/15 bg-white px-4 text-sm text-neutral-800 outline-none transition focus:border-brand-700/50">
        <option>{field.placeholder}</option>
        {field.options?.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    );
  }

  return (
    <Input
      type={field.type ?? "text"}
      placeholder={field.placeholder}
      className="h-11 rounded-[18px] border-brand-800/15 bg-white px-4 text-sm text-neutral-800 focus-visible:border-brand-700/50 focus-visible:ring-brand-700/15"
    />
  );
}

export function AdminResourceAddView({ config, listHref }: AdminResourceAddViewProps) {
  const locale = useLocale();
  const t = useTranslations("admin");
  const isRtl = getDirection(locale as Locale) === "rtl";

  return (
    <div className="space-y-8">
      <section className={cn("flex", isRtl ? "justify-start" : "justify-end")}>
        <Link
          href={listHref}
          className="inline-flex h-10 items-center gap-2 rounded-[14px] border border-brand-700/20 bg-[#fbf7f2] px-4 text-sm font-medium text-brand-800 transition hover:bg-brand-25"
        >
          <ArrowLeftIcon className={cn("size-4", isRtl && "rotate-180")} />
          {t("backToListing")}
        </Link>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_340px]">
        <div className="rounded-[30px] bg-white p-6 shadow-[0_18px_45px_rgba(80,5,22,0.06)]">
          <div className={cn("flex items-center gap-3", isRtl && "flex-row-reverse text-right")}>
            <div className="flex size-11 items-center justify-center rounded-[18px] bg-[#f8efe7] text-brand-800">
              <PlusIcon className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                {t("entityDetails", { entity: config.entityLabel })}
              </h3>
              <p className="text-sm text-neutral-500">{t("uiReady")}</p>
            </div>
          </div>

          <form className="mt-6 grid gap-4 md:grid-cols-2">
            {config.fields.map((field) => (
              <div
                key={field.label}
                className={field.type === "textarea" ? "space-y-2 md:col-span-2" : "space-y-2"}
              >
                <Label className={cn("text-sm font-semibold text-neutral-700", isRtl && "justify-end text-right")}>
                  {field.label}
                </Label>
                <FieldControl field={field} />
              </div>
            ))}

            <div className="rounded-[22px] bg-[#fcf7f0] px-4 py-3 text-sm text-neutral-500 md:col-span-2">
              {t("repositoryNotice")}
            </div>

            <div className={cn("flex flex-wrap gap-3 md:col-span-2", isRtl && "flex-row-reverse")}>
              <Button className="h-11 rounded-[18px] bg-brand-800 px-5 text-white hover:bg-brand-800/90">
                {t("saveEntity", { entity: config.entityLabel })}
              </Button>
              <Link
                href={listHref}
                className="inline-flex h-11 items-center rounded-[18px] border border-brand-700/20 bg-[#fbf7f2] px-5 text-sm font-medium text-brand-800 transition hover:bg-brand-25"
              >
                {t("cancel")}
              </Link>
            </div>
          </form>
        </div>

        <aside className={cn("rounded-[30px] bg-white p-6 shadow-[0_18px_45px_rgba(80,5,22,0.06)]", isRtl && "text-right")}>
          <h3 className="text-lg font-semibold text-neutral-900">{t("schemaMapping")}</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-500">{t("schemaMappingDescription")}</p>

          <div className="mt-5 space-y-3">
            {config.schemaTables.map((table) => (
              <div
                key={table}
                className="rounded-[18px] border border-brand-800/12 bg-[#fcf7f0] px-4 py-3 text-sm font-medium text-brand-900"
              >
                {table}
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
