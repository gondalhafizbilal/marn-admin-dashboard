import { setRequestLocale } from "next-intl/server";

import { AdminResourceListView } from "@/components/layout";
import { getAdminResourceConfig } from "@/constants/admin-resources";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminResourceListView config={getAdminResourceConfig("settings")} addHref="/settings/add" />
  );
}
