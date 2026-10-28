import { setRequestLocale } from "next-intl/server";

import { PaymentHistory } from "@/features/operations/components/payment-history";

type PaymentsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PaymentsPage({ params }: PaymentsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PaymentHistory />;
}
