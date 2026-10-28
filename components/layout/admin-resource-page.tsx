import { PlusIcon, SearchIcon } from "lucide-react";

import type { AdminResourceConfig, AdminResourceField } from "@/constants/admin-resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function FieldControl({ field }: { field: AdminResourceField }) {
  if (field.type === "textarea") {
    return (
      <textarea
        className="min-h-[112px] w-full rounded-[18px] border border-brand-800/15 bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-brand-700/50"
        placeholder={field.placeholder}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select className="h-11 w-full rounded-[18px] border border-brand-800/15 bg-white px-4 text-sm text-neutral-800 outline-none transition focus:border-brand-700/50">
        <option>{field.placeholder}</option>
        {field.options?.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    );
  }

  return (
    <Input
      type={field.type ?? "text"}
      placeholder={field.placeholder}
      className="h-11 rounded-[18px] border-brand-800/15 bg-white px-4 text-sm text-neutral-800 focus-visible:border-brand-700/50 focus-visible:ring-brand-700/15"
    />
  );
}

export function AdminResourcePage({ config }: { config: AdminResourceConfig }) {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] bg-white/80 p-6 shadow-[0_14px_34px_rgba(80,5,22,0.06)] ring-1 ring-white/80">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700/60">
              Admin Module
            </p>
            <h2 className="mt-2 text-[1.9rem] font-semibold text-neutral-900">{config.title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">{config.description}</p>
          </div>

          <div className="rounded-[22px] bg-[#f8f1e7] px-5 py-4 text-sm text-brand-900 shadow-[0_8px_24px_rgba(80,5,22,0.05)]">
            <p className="font-semibold">Schema Tables</p>
            <p className="mt-2 max-w-md leading-6 text-brand-900/75">
              {config.schemaTables.join(" • ")}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.9fr)]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-[24px] bg-white px-5 py-4 shadow-[0_12px_30px_rgba(80,5,22,0.05)]">
              <p className="text-sm text-neutral-400">Total {config.title}</p>
              <p className="mt-2 text-2xl font-semibold text-brand-900">{config.rows.length}</p>
            </article>
            <article className="rounded-[24px] bg-white px-5 py-4 shadow-[0_12px_30px_rgba(80,5,22,0.05)]">
              <p className="text-sm text-neutral-400">Primary Entity</p>
              <p className="mt-2 text-2xl font-semibold text-brand-900">{config.entityLabel}</p>
            </article>
            <article className="rounded-[24px] bg-white px-5 py-4 shadow-[0_12px_30px_rgba(80,5,22,0.05)]">
              <p className="text-sm text-neutral-400">Linked Tables</p>
              <p className="mt-2 text-2xl font-semibold text-brand-900">
                {config.schemaTables.length}
              </p>
            </article>
          </div>

          <div className="rounded-[30px] bg-white p-6 shadow-[0_18px_45px_rgba(80,5,22,0.06)]">
            <div className="flex flex-col gap-4 border-b border-brand-800/12 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{config.title} Listing</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Admin can review, search, and moderate these records.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex h-10 items-center gap-2 rounded-[18px] border border-brand-800/12 bg-[#fbf7f2] px-4 text-sm text-neutral-500">
                  <SearchIcon className="size-4 text-brand-700/60" />
                  Search {config.title.toLowerCase()}
                </div>
                <Button
                  variant="outline"
                  className="h-10 rounded-[18px] border-brand-700/20 bg-[#fbf7f2] px-4 text-brand-800 hover:bg-brand-25"
                >
                  Filter
                </Button>
              </div>
            </div>

            <div className="mt-5 hidden rounded-[20px] bg-[#fcf7f0] px-5 py-3 lg:grid lg:grid-cols-4 lg:gap-4">
              {config.columns.map((column) => (
                <p
                  key={column}
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700/55"
                >
                  {column}
                </p>
              ))}
            </div>

            <div className="mt-4 space-y-4">
              {config.rows.map((row, index) => (
                <article
                  key={`${config.title}-${index}`}
                  className="rounded-[24px] bg-white px-5 py-5 shadow-[0_10px_28px_rgba(80,5,22,0.05)] ring-1 ring-[#f3ebe2]"
                >
                  <div className="grid gap-4 lg:grid-cols-4">
                    {row.map((cell, cellIndex) => (
                      <div key={`${config.title}-${index}-${cellIndex}`}>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand-700/45 lg:hidden">
                          {config.columns[cellIndex]}
                        </p>
                        <p className="mt-1 text-sm font-medium text-neutral-800">{cell}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="rounded-[30px] bg-white p-6 shadow-[0_18px_45px_rgba(80,5,22,0.06)]">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-[18px] bg-[#f8efe7] text-brand-800">
              <PlusIcon className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Add {config.entityLabel}</h3>
              <p className="text-sm text-neutral-500">
                Prepare the admin form structure for this schema entity.
              </p>
            </div>
          </div>

          <form className="mt-6 space-y-4">
            {config.fields.map((field) => (
              <div key={field.label} className="space-y-2">
                <Label className="text-sm font-semibold text-neutral-700">{field.label}</Label>
                <FieldControl field={field} />
              </div>
            ))}

            <div className="rounded-[22px] bg-[#fcf7f0] px-4 py-3 text-sm text-neutral-500">
              This screen is a schema preview. Use the dedicated management modules for live
              changes.
            </div>

            <Button className="h-11 w-full rounded-[18px] bg-brand-800 text-white hover:bg-brand-800/90">
              Save {config.entityLabel}
            </Button>
          </form>
        </aside>
      </section>
    </div>
  );
}
