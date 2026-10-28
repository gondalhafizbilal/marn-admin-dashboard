import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CategoryUpdateForm } from "@/features/categories/components/category-update-form";
import { CategoryRepository } from "@/services";

type CategoryEditPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function CategoryEditPage({ params }: CategoryEditPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  let category;

  try {
    category = await CategoryRepository.findById(id);
  } catch {
    notFound();
  }

  if (!category) {
    notFound();
  }

  return (
    <CategoryUpdateForm
      categoryId={id}
      initialName={category.name}
      initialDescription={category.description}
      listHref="/categories"
    />
  );
}
