import { setRequestLocale } from "next-intl/server";

import { AdminResourceListView } from "@/components/layout";
import { getAdminResourceConfig } from "@/constants/admin-resources";

type PackagesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PackagesPage({ params }: PackagesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminResourceListView config={getAdminResourceConfig("packages")} addHref="/packages/add" />
  );
}
