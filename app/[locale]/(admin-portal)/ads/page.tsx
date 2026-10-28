import { setRequestLocale } from "next-intl/server";

import { ListingModeration } from "@/features/agencies/components/listing-moderation";

type AdsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdsPage({ params }: AdsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ListingModeration />;
}
