import { setRequestLocale } from "next-intl/server";
import { LocationManager } from "@/features/configuration/components/location-manager";

export default async function LocationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LocationManager />;
}
