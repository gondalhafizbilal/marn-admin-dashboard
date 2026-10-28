"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminRepository, isAppApiError, type AdminRecord } from "@/services";

type Resource =
  | "skills"
  | "workers"
  | "services"
  | "customers"
  | "plans"
  | "tiers"
  | "countries"
  | "cities"
  | "payments";

const loaders: Record<Resource, () => Promise<AdminRecord[] | { data: AdminRecord[] }>> = {
  skills: () => AdminRepository.skills(),
  workers: () => AdminRepository.workers(),
  services: () => AdminRepository.services(),
  customers: () => AdminRepository.customers(),
  plans: () => AdminRepository.subscriptionPlans(),
  tiers: () => AdminRepository.tiers(),
  countries: () => AdminRepository.countries(),
  cities: () => AdminRepository.cities(),
  payments: () => AdminRepository.payments(),
};

export function AdminLiveRecordsView({ resource, title }: { resource: Resource; title: string }) {
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    void loaders[resource]()
      .then((result) => setRecords(Array.isArray(result) ? result : result.data))
      .catch((error) =>
        toast.error(
          isAppApiError(error) ? error.message : `Unable to load ${title.toLowerCase()}.`,
        ),
      )
      .finally(() => setLoading(false));
  }, [resource, title]);
  if (loading)
    return <p className="p-6 text-sm text-neutral-500">Loading {title.toLowerCase()}…</p>;
  if (!records.length)
    return <p className="p-6 text-sm text-neutral-500">No {title.toLowerCase()} found.</p>;
  return (
    <section className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="overflow-auto rounded-xl border border-neutral-200 bg-white">
        <pre className="p-4 text-xs text-neutral-800">{JSON.stringify(records, null, 2)}</pre>
      </div>
    </section>
  );
}
