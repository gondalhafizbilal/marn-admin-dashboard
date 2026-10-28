import { setRequestLocale } from "next-intl/server";

import { AgencyManagementList } from "@/features/agencies/components/agency-management-list";

type AgenciesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AgenciesPage({ params }: AgenciesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AgencyManagementList />;
}
