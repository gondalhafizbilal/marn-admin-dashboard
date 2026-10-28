import { setRequestLocale } from "next-intl/server";

import type { CategoryTreeNode } from "@/features/categories";
import { CategoryCreateForm } from "@/features/categories/components/category-create-form";
import { CategoryRepository } from "@/services";

type PageProps = {
  params: Promise<{ locale: string }>;
};

function flattenParentOptions(nodes: CategoryTreeNode[], parentPath = ""): Array<{ label: string; value: string }> {
  return nodes.flatMap((node) => {
    const currentPath = parentPath ? `${parentPath} / ${node.name}` : node.name;
    const options = [{ label: currentPath, value: node.uuid }];

    if (node.children?.length) {
      options.push(...flattenParentOptions(node.children, currentPath));
    }

    return options;
  });
}

export default async function AddCategoryPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  let parentOptions: Array<{ label: string; value: string }> = [];

  try {
    const tree = await CategoryRepository.findTree();
    parentOptions = flattenParentOptions(tree);
  } catch {
    parentOptions = [];
  }

  return <CategoryCreateForm listHref="/categories" parentOptions={parentOptions} />;
}
