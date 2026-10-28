import { getTranslations, setRequestLocale } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  return (
    <div>
      <h1 className="text-2xl font-semibold">{t("projects.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("common.comingSoon")}</p>
    </div>
  );
}
