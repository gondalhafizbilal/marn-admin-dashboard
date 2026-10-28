import { setRequestLocale } from "next-intl/server";

import { AdminPagePlaceholder } from "@/components/layout";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminPagePlaceholder
      title="Profile"
      description="This route is available but not shown in the sidebar."
    />
  );
}
