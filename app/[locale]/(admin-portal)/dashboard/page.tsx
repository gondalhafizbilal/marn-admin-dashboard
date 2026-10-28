import {
  CheckCircle2Icon,
  EyeIcon,
  FileTextIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  Share2Icon,
  ShieldCheckIcon,
  ShieldXIcon,
  Trash2Icon,
} from "lucide-react";
import { setRequestLocale } from "next-intl/server";

const stats = [
  { label: "Total Ads", value: "300", icon: CheckCircle2Icon },
  { label: "Active", value: "268", icon: ShieldCheckIcon },
  { label: "Inactive", value: "132", icon: ShieldXIcon },
  { label: "Drafts", value: "25", icon: FileTextIcon },
] as const;

const listings = [
  {
    id: "1",
    name: "Ahmed Al-Marri",
    location: "Doha, Qatar",
    category: "Housemaid",
    price: "QAR2500",
    billing: "/mon",
    status: "Active",
    createdAt: "Nov 01, 2026",
    views: 250,
    clicks: 50,
  },
  {
    id: "2",
    name: "Ahmed Al-Marri",
    location: "Doha, Qatar",
    category: "Housemaid",
    price: "QAR2500",
    billing: "/mon",
    status: "Active",
    createdAt: "Nov 01, 2026",
    views: 250,
    clicks: 50,
  },
  {
    id: "3",
    name: "Ahmed Al-Marri",
    location: "Doha, Qatar",
    category: "Housemaid",
    price: "QAR2500",
    billing: "/mon",
    status: "Active",
    createdAt: "Nov 01, 2026",
    views: 250,
    clicks: 50,
  },
  {
    id: "4",
    name: "Ahmed Al-Marri",
    location: "Doha, Qatar",
    category: "Housemaid",
    price: "QAR2500",
    billing: "/mon",
    status: "Active",
    createdAt: "Nov 01, 2026",
    views: 250,
    clicks: 50,
  },
] as const;

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <article className="rounded-[28px] bg-white px-6 py-5 shadow-[0_12px_30px_rgba(80,5,22,0.05)]">
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-[20px] bg-[#f7efe6] text-brand-800">
          <Icon className="size-7" />
        </div>
        <div>
          <p className="text-[0.95rem] font-medium text-[#a6acb7]">{label}</p>
          <p className="mt-1 text-[1.1rem] font-semibold text-neutral-900">{value}</p>
        </div>
      </div>
    </article>
  );
}

function ActionButton({
  label,
  icon: Icon,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-brand-700/65 px-2.5 text-[0.86rem] font-medium text-brand-800 transition-colors hover:bg-brand-25"
    >
      <Icon className="size-3.5" />
      <span>{label}</span>
    </button>
  );
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-8">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section>
        <div className="flex items-end justify-between border-b border-brand-800/35 pb-4">
          <div className="flex items-center gap-8 text-[0.95rem]">
            <button
              type="button"
              className="relative pb-2 font-semibold text-brand-800 after:absolute after:bottom-[-17px] after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-brand-700"
            >
              All Ads
            </button>
            <button type="button" className="pb-2 text-[#b68d8f]">
              Active
            </button>
            <button type="button" className="pb-2 text-[#b68d8f]">
              Inactive
            </button>
          </div>

          <button
            type="button"
            className="text-[0.95rem] font-medium text-brand-800 underline underline-offset-4"
          >
            View All
          </button>
        </div>
      </section>

      <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_45px_rgba(80,5,22,0.06)]">
        <div className="space-y-4">
          {listings.map((listing) => (
            <article
              key={listing.id}
              className="rounded-[22px] bg-white px-4 py-4 shadow-[0_10px_28px_rgba(80,5,22,0.05)] ring-1 ring-[#f3ebe2]"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#f0c08f_0%,#b57841_100%)] text-sm font-semibold text-white">
                    AA
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <h3 className="text-[0.95rem] font-semibold text-neutral-900">
                        {listing.name}
                      </h3>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.9rem] text-[#a0a7b2]">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPinIcon className="size-4" />
                        {listing.location}
                      </span>
                      <span>{listing.category}</span>
                      <span className="font-semibold text-brand-800">
                        {listing.price}
                        <span className="font-normal text-[#a0a7b2]">{listing.billing}</span>
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex h-8 items-center gap-2 rounded-[8px] bg-[#fae8ea] px-3 text-[0.9rem] text-brand-800">
                        <CheckCircle2Icon className="size-4" />
                        Active
                      </span>
                      <span className="inline-flex h-8 items-center gap-2 rounded-[8px] bg-[#fae8ea] px-3 text-[0.9rem] text-brand-800">
                        <EyeIcon className="size-4" />
                        {listing.views} Views
                      </span>
                      <span className="inline-flex h-8 items-center gap-2 rounded-[8px] bg-[#fae8ea] px-3 text-[0.9rem] text-brand-800">
                        <PhoneIcon className="size-4" />
                        {listing.clicks} Clicks
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col items-start gap-3 xl:items-end">
                  <span className="inline-flex rounded-full border border-emerald-600/60 bg-emerald-50 px-4 py-1 text-[0.9rem] font-medium text-emerald-700">
                    {listing.status}
                  </span>
                  <p className="text-[0.82rem] text-brand-800/80">
                    <span className="font-semibold">Date Created:</span> {listing.createdAt} (Valid
                    for 30 Days)
                  </p>

                  <div className="flex flex-wrap gap-2 xl:justify-end">
                    <ActionButton label="Update Status" icon={CheckCircle2Icon} />
                    <ActionButton label="Share" icon={Share2Icon} />
                    <ActionButton label="Edit" icon={PencilIcon} />
                    <ActionButton label="Delete" icon={Trash2Icon} />
                    <ActionButton label="View" icon={EyeIcon} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-end gap-4 pt-2 text-[0.95rem] text-brand-800">
        <button type="button" className="font-medium">
          Previous
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl bg-brand-800 text-white"
          >
            1
          </button>
          <button type="button" className="flex size-10 items-center justify-center rounded-xl">
            2
          </button>
          <button type="button" className="flex size-10 items-center justify-center rounded-xl">
            3
          </button>
          <button type="button" className="flex size-10 items-center justify-center rounded-xl">
            4
          </button>
        </div>
        <button type="button" className="font-medium">
          Next
        </button>
      </section>
    </div>
  );
}
