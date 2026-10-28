import { setRequestLocale } from "next-intl/server";

import { AdminResourceAddView } from "@/components/layout";
import { getAdminResourceConfig } from "@/constants/admin-resources";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AddMessagePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AdminResourceAddView config={getAdminResourceConfig("messages")} listHref="/messages" />;
}
