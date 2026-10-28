import { setRequestLocale } from "next-intl/server";
import { SubscriptionPlanManager } from "@/features/configuration/components/subscription-plan-manager";

export default async function PlansPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SubscriptionPlanManager />;
}
