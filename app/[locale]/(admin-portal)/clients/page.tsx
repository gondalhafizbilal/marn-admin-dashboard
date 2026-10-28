import { setRequestLocale } from "next-intl/server";

import { CustomerManagement } from "@/features/clients/components/customer-management";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ClientsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CustomerManagement />;
}
