import { setRequestLocale } from "next-intl/server";
import { TierManager } from "@/features/configuration/components/tier-manager";

export default async function TiersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TierManager />;
}
