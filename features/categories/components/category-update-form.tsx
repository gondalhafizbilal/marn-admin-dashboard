"use client";

import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryRepository, isAppApiError } from "@/services";

type CategoryUpdateFormProps = {
  categoryId: string;
  initialName: string;
  initialDescription?: string | null;
  listHref: string;
};

export function CategoryUpdateForm({
  categoryId,
  initialName,
  initialDescription,
  listHref,
}: CategoryUpdateFormProps) {
  const t = useTranslations("admin");
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await CategoryRepository.update(categoryId, {
        name: trimmedName,
        description: description.trim() ? description.trim() : null,
      });

      router.push(listHref);
    } catch (caughtError) {
      if (isAppApiError(caughtError)) {
        setError(caughtError.message);
        return;
      }

      setError("Unable to update category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="flex justify-end">
        <Link
          href={listHref}
          className="inline-flex h-10 items-center gap-2 rounded-[14px] border border-brand-700/20 bg-[#fbf7f2] px-4 text-sm font-medium text-brand-800 transition hover:bg-brand-25"
        >
          <ArrowLeftIcon className="size-4" />
          {t("backToListing")}
        </Link>
      </section>

      <section className="rounded-[30px] bg-white p-6 shadow-[0_18px_45px_rgba(80,5,22,0.06)]">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-[18px] bg-[#f8efe7] text-brand-800">
            <PencilIcon className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Update Category</h3>
            <p className="text-sm text-neutral-500">Update the category name and description.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-semibold text-neutral-700">Name</Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter category name"
              className="h-11 rounded-[18px] border-brand-800/15 bg-white px-4 text-sm text-neutral-800 focus-visible:border-brand-700/50 focus-visible:ring-brand-700/15"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-semibold text-neutral-700">Description</Label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional category description"
              className="min-h-[120px] w-full rounded-[18px] border border-brand-800/15 bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-brand-700/50"
            />
          </div>

          {error ? (
            <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-[18px] bg-brand-800 px-5 text-white hover:bg-brand-800/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Updating..." : "Update Category"}
            </Button>
            <Link
              href={listHref}
              className="inline-flex h-11 items-center rounded-[18px] border border-brand-700/20 bg-[#fbf7f2] px-5 text-sm font-medium text-brand-800 transition hover:bg-brand-25"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
