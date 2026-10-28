"use client";

import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  EyeIcon,
  SlidersHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import type { AdminResourceConfig } from "@/constants/admin-resources";
import { getDirection, type Locale } from "@/i18n/config";
import { Link, useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CategoryRepository, isAppApiError } from "@/services";

type AdminResourceListViewProps = {
  config: AdminResourceConfig;
  addHref: string;
};

const PAGE_SIZE = 4;

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function isPositiveStatus(status: string) {
  return [
    "active",
    "verified",
    "published",
    "confirmed",
    "completed",
    "captured",
    "open",
    "delivered",
  ].some((item) => status.toLowerCase().includes(item));
}

function isAttentionStatus(status: string) {
  return [
    "pending",
    "review",
    "draft",
    "paused",
    "queued",
    "flagged",
    "suspended",
    "inactive",
    "waiting",
    "closed",
    "archived",
    "refunded",
  ].some((item) => status.toLowerCase().includes(item));
}

function getTranslatedStatus(
  status: string,
  t: ReturnType<typeof useTranslations<"admin">>,
) {
  const value = status.toLowerCase();

  if (value.includes("active")) return t("statusActive");
  if (value.includes("verified")) return t("statusVerified");
  if (value.includes("published")) return t("statusPublished");
  if (value.includes("confirmed")) return t("statusConfirmed");
  if (value.includes("completed")) return t("statusCompleted");
  if (value.includes("captured")) return t("statusCaptured");
  if (value.includes("open")) return t("statusOpen");
  if (value.includes("delivered")) return t("statusDelivered");
  if (value.includes("pending")) return t("statusPending");
  if (value.includes("review")) return t("statusReview");
  if (value.includes("draft")) return t("statusDraft");
  if (value.includes("paused")) return t("statusPaused");
  if (value.includes("queued")) return t("statusQueued");
  if (value.includes("flagged")) return t("statusFlagged");
  if (value.includes("suspended")) return t("statusSuspended");
  if (value.includes("inactive")) return t("statusInactive");
  if (value.includes("waiting")) return t("statusWaiting");
  if (value.includes("closed")) return t("statusClosed");
  if (value.includes("archived")) return t("statusArchived");
  if (value.includes("refunded")) return t("statusRefunded");

  return status;
}

export function AdminResourceListView({ config, addHref }: AdminResourceListViewProps) {
  const locale = useLocale();
  const t = useTranslations("admin");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedNationalities, setSelectedNationalities] = useState(["Pakistan"]);
  const [priceRange, setPriceRange] = useState(42);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredRows = config.rows.filter((row) =>
    row.some((cell) => cell.toLowerCase().includes(search.toLowerCase())),
  );
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageRows = filteredRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const positiveCount = config.rows.filter((row) => isPositiveStatus(row[3] ?? "")).length;
  const attentionCount = config.rows.filter((row) => isAttentionStatus(row[3] ?? "")).length;
  const showAvatar = config.showAvatar !== false;
  const canAdd = config.canAdd !== false;
  const canEdit = config.canEdit !== false;
  const canDelete = config.canDelete !== false;
  const popupSelectFields = config.fields.filter((field) => field.type === "select").slice(0, 3);
  const nationalities = ["Pakistan", "India", "Qatar", "UAE", "Bangladesh"];
  const sortOptions = [
    t("sortNewest"),
    t("sortOldest"),
    t("sortStatus"),
    t("sortNameAsc"),
    t("sortNameDesc"),
  ];
  const isRtl = getDirection(locale as Locale) === "rtl";

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!isFilterOpen && !isSortOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFilterOpen(false);
        setIsSortOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFilterOpen, isSortOpen]);

  async function handleDeleteRecord(recordId: string) {
    if (!recordId || config.key !== "categories") {
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) {
      return;
    }

    setDeletingId(recordId);

    try {
      await CategoryRepository.remove(recordId);
      router.refresh();
    } catch (error) {
      const message = isAppApiError(error) ? error.message : "Unable to delete category.";
      window.alert(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      {canAdd ? (
        <section className={cn("flex", isRtl ? "justify-start" : "justify-end")}>
          <Link
            href={addHref}
            className="inline-flex h-9 items-center gap-2 rounded-[12px] bg-brand-800 px-4 text-[0.9rem] font-medium text-white transition hover:bg-brand-800/90"
          >
            <PlusIcon className="size-4" />
            {t("addEntity", { entity: config.entityLabel })}
          </Link>
        </section>
      ) : null}

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-[28px] bg-white px-6 py-5 shadow-[0_12px_30px_rgba(80,5,22,0.05)]">
          <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse text-right")}>
            <div className="flex size-14 items-center justify-center rounded-[20px] bg-[#f7efe6] text-brand-800">
              <CheckCircle2Icon className="size-7" />
            </div>
            <div>
              <p className="text-[0.95rem] font-medium text-[#a6acb7]">
                {t("totalEntity", { entity: config.title })}
              </p>
              <p className="mt-1 text-[1.1rem] font-semibold text-neutral-900">{config.rows.length}</p>
            </div>
          </div>
        </article>

        <article className="rounded-[28px] bg-white px-6 py-5 shadow-[0_12px_30px_rgba(80,5,22,0.05)]">
          <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse text-right")}>
            <div className="flex size-14 items-center justify-center rounded-[20px] bg-[#f7efe6] text-brand-800">
              <ShieldCheckIcon className="size-7" />
            </div>
            <div>
              <p className="text-[0.95rem] font-medium text-[#a6acb7]">{t("healthyRecords")}</p>
              <p className="mt-1 text-[1.1rem] font-semibold text-neutral-900">{positiveCount}</p>
            </div>
          </div>
        </article>

        <article className="rounded-[28px] bg-white px-6 py-5 shadow-[0_12px_30px_rgba(80,5,22,0.05)]">
          <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse text-right")}>
            <div className="flex size-14 items-center justify-center rounded-[20px] bg-[#f7efe6] text-brand-800">
              <ShieldAlertIcon className="size-7" />
            </div>
            <div>
              <p className="text-[0.95rem] font-medium text-[#a6acb7]">{t("needsAttention")}</p>
              <p className="mt-1 text-[1.1rem] font-semibold text-neutral-900">{attentionCount}</p>
            </div>
          </div>
        </article>
      </section>

      <section>
        <div className={cn("flex items-end justify-between border-b border-brand-800/35 pb-4", isRtl && "flex-row-reverse")}>
          <div className={cn("flex items-center gap-8 text-[0.95rem]", isRtl && "flex-row-reverse")}>
            <button
              type="button"
              className={cn(
                "relative pb-2 font-semibold text-brand-800 after:absolute after:bottom-[-17px] after:h-[3px] after:w-full after:rounded-full after:bg-brand-700",
                isRtl ? "after:right-0" : "after:left-0",
              )}
            >
              {t("allEntity", { entity: config.title })}
            </button>
            <span className="pb-2 text-[#b68d8f]">{t("entityRecords", { entity: config.entityLabel })}</span>
          </div>

          <div className={cn("flex w-full max-w-[640px] items-center gap-3", isRtl ? "justify-start flex-row-reverse" : "justify-end")}>
            <div className="relative w-full max-w-[280px]">
              <SearchIcon
                className={cn(
                  "pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-brand-700/50",
                  isRtl ? "right-4" : "left-4",
                )}
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("searchEntity", { entity: config.title })}
                className={cn(
                  "h-10 rounded-[16px] border-brand-800/15 bg-white text-sm focus-visible:border-brand-700/40 focus-visible:ring-brand-700/10",
                  isRtl ? "pr-10 text-right" : "pl-10",
                )}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSortOpen(true);
                setIsFilterOpen(false);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-brand-700/65 px-4 text-[0.95rem] font-medium text-brand-800 transition-colors hover:bg-brand-25"
            >
              {t("sortBy")}
              <ChevronDownIcon className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsFilterOpen(true);
                setIsSortOpen(false);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-brand-700/65 px-4 text-[0.95rem] font-medium text-brand-800 transition-colors hover:bg-brand-25"
            >
              {t("filters")}
              <SlidersHorizontalIcon className="size-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_45px_rgba(80,5,22,0.06)]">
        <div className="space-y-4">
          {pageRows.length ? (
            pageRows.map((row, index) => {
              const title = row[0] ?? `${config.entityLabel} ${index + 1}`;
              const secondary = row[1] ?? "";
              const tertiary = row[2] ?? "";
              const status = row[3] ?? "Draft";
              const positive = isPositiveStatus(status);
              const translatedStatus = getTranslatedStatus(status, t);
              const recordIndex = (safePage - 1) * PAGE_SIZE + index;
              const recordId = config.recordIds?.[recordIndex];
              const viewHref = recordId && config.viewBaseHref ? `${config.viewBaseHref}/${recordId}` : undefined;
              const editHref = recordId && config.editBaseHref ? `${config.editBaseHref}/${recordId}/edit` : undefined;

              return (
                <article
                  key={`${config.title}-${safePage}-${index}`}
                  className="rounded-[22px] bg-white px-4 py-4 shadow-[0_10px_28px_rgba(80,5,22,0.05)] ring-1 ring-[#f3ebe2]"
                >
                  <div className={cn("flex flex-col gap-4 xl:items-center xl:justify-between", isRtl ? "xl:flex-row-reverse" : "xl:flex-row")}>
                    <div className={cn("flex min-w-0 gap-4", isRtl && "flex-row-reverse text-right")}>
                      {showAvatar ? (
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#f0c08f_0%,#b57841_100%)] text-sm font-semibold text-white">
                          {getInitials(title)}
                        </div>
                      ) : null}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          <h3 className="text-[0.95rem] font-semibold text-neutral-900">{title}</h3>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.9rem] text-[#a0a7b2]">
                          <span>
                            {config.columns[1]}: {secondary}
                          </span>
                          <span>
                            {config.columns[2]}: {tertiary}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex h-8 items-center gap-2 rounded-[8px] bg-[#fae8ea] px-3 text-[0.9rem] text-brand-800">
                            <CheckCircle2Icon className="size-4" />
                            {config.columns[3]}: {translatedStatus}
                          </span>
                          <span className="inline-flex h-8 items-center rounded-[8px] bg-[#fae8ea] px-3 text-[0.9rem] text-brand-800">
                            {config.columns[1]}
                          </span>
                          <span className="inline-flex h-8 items-center rounded-[8px] bg-[#fae8ea] px-3 text-[0.9rem] text-brand-800">
                            {config.columns[2]}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "flex min-w-0 flex-1 flex-col gap-3",
                        isRtl ? "items-end text-right xl:items-start" : "items-start xl:items-end",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex rounded-full px-4 py-1 text-[0.9rem] font-medium",
                          positive
                            ? "border border-emerald-600/60 bg-emerald-50 text-emerald-700"
                            : "border border-brand-700/35 bg-[#fae8ea] text-brand-800",
                        )}
                      >
                        {translatedStatus}
                      </span>
                      <p className="text-[0.82rem] text-brand-800/80">
                        <span className="font-semibold">{t("schema")}:</span> {config.schemaTables[0]}
                      </p>

                      <div className={cn("flex flex-wrap gap-2", isRtl ? "xl:justify-start" : "xl:justify-end")}>
                        {viewHref ? (
                          <Link
                            href={viewHref}
                            className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-brand-700/65 px-2.5 text-[0.86rem] font-medium text-brand-800 transition-colors hover:bg-brand-25"
                          >
                            <EyeIcon className="size-3.5" />
                            <span>{t("view")}</span>
                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="inline-flex h-8 cursor-not-allowed items-center gap-1.5 rounded-[8px] border border-brand-700/65 px-2.5 text-[0.86rem] font-medium text-brand-800/60 opacity-70"
                          >
                            <EyeIcon className="size-3.5" />
                            <span>{t("view")}</span>
                          </button>
                        )}
                        {canEdit ? (
                          editHref ? (
                            <Link
                              href={editHref}
                              className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-brand-700/65 px-2.5 text-[0.86rem] font-medium text-brand-800 transition-colors hover:bg-brand-25"
                            >
                              <PencilIcon className="size-3.5" />
                              <span>{t("edit")}</span>
                            </Link>
                          ) : (
                            <Link
                              href={addHref}
                              className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-brand-700/65 px-2.5 text-[0.86rem] font-medium text-brand-800 transition-colors hover:bg-brand-25"
                            >
                              <PencilIcon className="size-3.5" />
                              <span>{t("edit")}</span>
                            </Link>
                          )
                        ) : null}
                        {canDelete ? (
                          config.key === "categories" && recordId ? (
                            <button
                              type="button"
                              disabled={deletingId === recordId}
                              onClick={() => handleDeleteRecord(recordId)}
                              className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-brand-700/65 px-2.5 text-[0.86rem] font-medium text-brand-800 transition-colors hover:bg-brand-25 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Trash2Icon className="size-3.5" />
                              <span>{deletingId === recordId ? "Deleting..." : t("delete")}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-brand-700/65 px-2.5 text-[0.86rem] font-medium text-brand-800 transition-colors hover:bg-brand-25"
                            >
                              <Trash2Icon className="size-3.5" />
                              <span>{t("delete")}</span>
                            </button>
                          )
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-[24px] border border-dashed border-brand-700/20 bg-brand-25/20 px-6 py-12 text-center text-sm text-neutral-500">
              {t("noResults", { entity: config.title })}
            </div>
          )}
        </div>
      </section>

      <section
        className={cn(
          "flex flex-wrap items-center gap-4 pt-2 text-[0.95rem] text-brand-800",
          isRtl ? "justify-start flex-row-reverse" : "justify-end",
        )}
      >
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={safePage === 1}
          className="inline-flex items-center gap-1 font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isRtl ? <ChevronRightIcon className="size-4" /> : <ChevronLeftIcon className="size-4" />}
          {t("previous")}
        </button>
        <div className="flex items-center gap-2">
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setCurrentPage(pageNumber)}
              className={cn(
                "flex size-10 items-center justify-center rounded-xl transition-colors",
                pageNumber === safePage ? "bg-brand-800 text-white" : "hover:bg-brand-25",
              )}
            >
              {pageNumber}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          disabled={safePage === totalPages}
          className="inline-flex items-center gap-1 font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("next")}
          {isRtl ? <ChevronLeftIcon className="size-4" /> : <ChevronRightIcon className="size-4" />}
        </button>
      </section>

      {isFilterOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(37,19,19,0.24)] px-4 py-10">
          <div
            className={cn(
              "max-h-[90vh] w-full max-w-[610px] overflow-y-auto rounded-[34px] bg-white p-8 shadow-[0_32px_80px_rgba(80,5,22,0.22)]",
              isRtl && "text-right",
            )}
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="flex items-start justify-between">
              <div />
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="inline-flex size-11 items-center justify-center rounded-[14px] border-2 border-brand-800 text-brand-800"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <div className="mt-1 space-y-8">
              {popupSelectFields.map((field) => (
                <div key={field.label}>
                  <p className="text-[1rem] font-semibold text-neutral-900">{field.label}</p>
                  <div className="mt-3 flex h-12 items-center justify-between rounded-[14px] border border-[#d4dbe5] px-5 text-[0.95rem] text-neutral-500">
                    <span>{field.placeholder}</span>
                    <ChevronDownIcon className="size-5 text-brand-800" />
                  </div>
                </div>
              ))}

              <div>
                <p className="text-[1rem] font-semibold text-neutral-900">{t("nationality")}</p>
                <div className="mt-4 space-y-3">
                  {nationalities.map((nationality) => {
                    const isChecked = selectedNationalities.includes(nationality);
                    return (
                      <label key={nationality} className="flex items-center justify-between gap-4">
                        <span className="text-[0.95rem] text-neutral-700">{nationality}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedNationalities((current) =>
                              current.includes(nationality)
                                ? current.filter((item) => item !== nationality)
                                : [...current, nationality],
                            );
                          }}
                          className="size-7 rounded-[8px] border border-[#d4dbe5] accent-brand-800"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[1rem] font-semibold text-neutral-900">{t("priceRange")}</p>
                <div className="mt-5 px-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange}
                    onChange={(event) => setPriceRange(Number(event.target.value))}
                    className="h-2 w-full accent-brand-800"
                  />
                  <div className="mt-3 flex items-center justify-between text-[0.92rem] font-medium text-[#9ca5b1]">
                    <span>QAR100</span>
                    <span>QAR5000</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNationalities(["Pakistan"]);
                    setPriceRange(42);
                  }}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-[16px] text-[1rem] font-medium text-[#9ca5b1]"
                >
                  {t("reset")}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-[16px] bg-brand-700 text-[1rem] font-medium text-white"
                >
                  {t("apply")}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isSortOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(37,19,19,0.24)] px-4 py-10">
          <div
            className={cn(
              "w-full max-w-[460px] rounded-[30px] bg-white p-8 shadow-[0_32px_80px_rgba(80,5,22,0.22)]",
              isRtl && "text-right",
            )}
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[1.2rem] font-semibold text-neutral-900">{t("sortBy")}</p>
                <p className="mt-1 text-sm text-neutral-500">
                  {t("sortDescription", { entity: config.title })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSortOpen(false)}
                className="inline-flex size-11 items-center justify-center rounded-[14px] border-2 border-brand-800 text-brand-800"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {sortOptions.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setIsSortOpen(false)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-[16px] border px-4 py-3 text-left text-[0.96rem] transition-colors",
                    index === 0
                      ? "border-brand-700/40 bg-[#fae8ea] text-brand-800"
                      : "border-brand-800/12 text-neutral-700 hover:bg-brand-25",
                  )}
                >
                  <span>{option}</span>
                  {index === 0 ? <CheckCircle2Icon className="size-4" /> : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
