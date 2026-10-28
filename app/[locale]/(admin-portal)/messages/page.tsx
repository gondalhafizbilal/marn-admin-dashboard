import { setRequestLocale } from "next-intl/server";

import { AdminResourceListView } from "@/components/layout";
import { getAdminResourceConfig } from "@/constants/admin-resources";

type MessagesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function MessagesPage({ params }: MessagesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminResourceListView config={getAdminResourceConfig("messages")} addHref="/messages/add" />
  );
}
