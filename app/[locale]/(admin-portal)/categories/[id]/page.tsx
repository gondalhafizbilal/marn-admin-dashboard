import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { CategoryRepository } from "@/services";

type CategoryDetailPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

function formatValue(value: string | number | undefined | null) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  let category;

  try {
    category = await CategoryRepository.findById(id);
  } catch {
    notFound();
  }

  if (!category) {
    notFound();
  }

  const detailFields = [
    { label: "UUID", value: category.uuid },
    { label: "Name", value: category.name },
    { label: "Slug", value: category.slug },
    { label: "Level", value: category.level },
    { label: "Sort order", value: category.sortOrder },
    { label: "Parent UUID", value: category.parentUuid },
    { label: "Status", value: category.status ?? "Active" },
    { label: "Children", value: category.children?.length ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-[0_18px_45px_rgba(80,5,22,0.06)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-800/70">Category</p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">{category.name}</h1>
        </div>

        <Link href="/categories" className={cn(buttonVariants({ variant: "outline" }), "h-10")}>Back to categories</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {detailFields.map((field) => (
          <div key={field.label} className="rounded-[20px] border border-[#f3ebe2] bg-white p-4 shadow-[0_12px_28px_rgba(80,5,22,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-800/60">{field.label}</p>
            <p className="mt-2 text-base font-medium text-neutral-900">{formatValue(field.value)}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[24px] border border-[#f3ebe2] bg-white p-5 shadow-[0_12px_28px_rgba(80,5,22,0.04)]">
        <h2 className="text-lg font-semibold text-neutral-900">Description</h2>
        <p className="mt-3 whitespace-pre-wrap text-[0.95rem] leading-7 text-neutral-700">
          {category.description || "No description provided for this category."}
        </p>
      </div>
    </div>
  );
}
