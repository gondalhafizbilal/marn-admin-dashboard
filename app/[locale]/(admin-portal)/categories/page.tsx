import { setRequestLocale } from "next-intl/server";

import { AdvertisementCategoryManager } from "@/features/categories/components/advertisement-category-manager";

type CategoriesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AdvertisementCategoryManager />;
}
