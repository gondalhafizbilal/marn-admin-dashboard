import { setRequestLocale } from "next-intl/server";

import { SkillManager } from "@/features/categories/components/skill-manager";

type SkillsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SkillsPage({ params }: SkillsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SkillManager />;
}
