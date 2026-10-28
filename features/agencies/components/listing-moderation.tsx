"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminRepository, isAppApiError, type AdminRecord } from "@/services";
const idOf = (x: AdminRecord) => String(x.uuid ?? x.id ?? "");
export function ListingModeration() {
  const [kind, setKind] = useState<"workers" | "services">("workers");
  const [items, setItems] = useState<AdminRecord[]>([]);
  const [selected, setSelected] = useState<AdminRecord | null>(null);
  const reload = useCallback(
    () =>
      (kind === "workers" ? AdminRepository.workers() : AdminRepository.services())
        .then((r) => setItems(r.data))
        .catch((e) => toast.error(isAppApiError(e) ? e.message : "Unable to load listings.")),
    [kind],
  );
  useEffect(() => {
    void reload();
  }, [reload]);
  async function status(item: AdminRecord, value: string) {
    const rejectionReason =
      value === "rejected" ? window.prompt("Reason for rejection") : undefined;
    if (value === "rejected" && !rejectionReason) return;
    try {
      const updated =
        kind === "workers"
          ? await AdminRepository.updateWorkerStatus(
              idOf(item),
              value,
              rejectionReason ?? undefined,
            )
          : await AdminRepository.updateServiceStatus(
              idOf(item),
              value,
              rejectionReason ?? undefined,
            );
      setItems((all) => all.map((x) => (idOf(x) === idOf(item) ? updated : x)));
      setSelected(updated);
      toast.success("Status updated.");
    } catch (e) {
      toast.error(isAppApiError(e) ? e.message : "Unable to update status.");
    }
  }
  return (
    <section className="space-y-5 p-6">
      <div className="space-x-3">
        <button onClick={() => setKind("workers")}>Workers</button>
        <button onClick={() => setKind("services")}>Service listings</button>
      </div>
      <div className="rounded-xl border bg-white">
        {items.map((item) => (
          <div key={idOf(item)} className="flex justify-between border-b p-3">
            <span>{String(item.name ?? item.title ?? "Untitled")}</span>
            <span className="space-x-3">
              <button onClick={() => setSelected(item)}>Details</button>
              <button onClick={() => void status(item, "active")}>Approve</button>
              <button onClick={() => void status(item, "rejected")}>Reject</button>
            </span>
          </div>
        ))}
      </div>
      {selected ? (
        <pre className="overflow-auto rounded bg-neutral-950 p-4 text-xs text-white">
          {JSON.stringify(selected, null, 2)}
        </pre>
      ) : null}
    </section>
  );
}
