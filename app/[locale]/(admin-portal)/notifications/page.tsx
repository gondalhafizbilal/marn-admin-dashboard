import { setRequestLocale } from "next-intl/server";

import { PushNotificationManager } from "@/features/operations/components/push-notification-manager";

type NotificationsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function NotificationsPage({ params }: NotificationsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PushNotificationManager />;
}
