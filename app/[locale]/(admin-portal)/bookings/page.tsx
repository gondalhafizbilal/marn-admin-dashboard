import { setRequestLocale } from "next-intl/server";

import { AdminResourceListView } from "@/components/layout";
import { getAdminResourceConfig } from "@/constants/admin-resources";

type BookingsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function BookingsPage({ params }: BookingsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminResourceListView config={getAdminResourceConfig("bookings")} addHref="/bookings/add" />
  );
}
