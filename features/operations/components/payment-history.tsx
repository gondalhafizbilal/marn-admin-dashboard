"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminRepository, isAppApiError, type AdminRecord } from "@/services";

const idOf = (item: AdminRecord) => String(item.uuid ?? item.id ?? "");

export function PaymentHistory() {
  const [payments, setPayments] = useState<AdminRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const reload = async () => {
    setLoading(true);
    try {
      setPayments(await AdminRepository.payments());
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to load payments.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void reload();
  }, []);
  const rows = useMemo(
    () =>
      payments.filter((payment) =>
        JSON.stringify(payment).toLowerCase().includes(query.toLowerCase()),
      ),
    [payments, query],
  );
  return (
    <section className="space-y-5 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Payments</h1>
          <p className="text-sm text-neutral-500">Transaction history from the payments API.</p>
        </div>
        <button className="rounded border px-3 py-2 text-sm" onClick={() => void reload()}>
          Refresh
        </button>
      </div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search transaction, provider, or status"
        className="w-full max-w-md rounded border p-2 text-sm"
      />
      {loading ? (
        <p className="text-sm text-neutral-500">Loading payments…</p>
      ) : (
        <div className="overflow-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Transaction</th>
                <th className="p-3">Provider</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((payment) => (
                <tr key={idOf(payment)} className="border-b">
                  <td className="p-3">{String(payment.transactionId ?? payment.id ?? "—")}</td>
                  <td className="p-3">{String(payment.provider ?? "—")}</td>
                  <td className="p-3">
                    {String((payment.amount as { amount?: number } | undefined)?.amount ?? "—")}{" "}
                    {String(payment.currency ?? "")}
                  </td>
                  <td className="p-3">{String(payment.status ?? "—")}</td>
                  <td className="p-3">{String(payment.createdAt ?? "—")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length ? <p className="p-4 text-sm text-neutral-500">No payments found.</p> : null}
        </div>
      )}
    </section>
  );
}
