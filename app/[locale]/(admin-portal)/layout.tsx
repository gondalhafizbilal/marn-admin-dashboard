import { setRequestLocale } from "next-intl/server";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminShell, dashboardNavSections } from "@/components/layout";

type AdminPortalLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminPortalLayout({ children, params }: AdminPortalLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AdminShell sections={dashboardNavSections}>{children}</AdminShell>
    </ProtectedRoute>
  );
}
