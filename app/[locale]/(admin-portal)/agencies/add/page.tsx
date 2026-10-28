import { setRequestLocale } from "next-intl/server";

import { AgencyCreateForm } from "@/features/agencies/components/agency-create-form";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AddAgencyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AgencyCreateForm />;
}
