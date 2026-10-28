import { setRequestLocale } from "next-intl/server";
import { AgencyCategoryManager } from "@/features/categories/components/agency-category-manager";
export default async function AgencyCategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AgencyCategoryManager />;
}
