"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminRepository, isAppApiError, type AdminRecord } from "@/services";

const agencyTypes = [
  "events",
  "hajj_umrah",
  "services",
  "car_services",
  "laundry",
  "home_projects",
];
const durations = ["4_months", "8_months", "12_months"];
const idOf = (item: AdminRecord) => String(item.uuid ?? item.id ?? "");

export function SubscriptionPlanManager() {
  const [plans, setPlans] = useState<AdminRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    agencyType: agencyTypes[0],
    duration: durations[0],
    amount: "",
    maxActiveListings: "10",
    isActive: true,
  });
  const reload = () =>
    AdminRepository.subscriptionPlans()
      .then(setPlans)
      .catch((error) =>
        toast.error(isAppApiError(error) ? error.message : "Unable to load plans."),
      );
  useEffect(() => {
    void reload();
  }, []);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await AdminRepository.createSubscriptionPlan({
        agencyType: form.agencyType,
        duration: form.duration,
        price: { amount: Number(form.amount), minorAmount: 0, currencyCode: "QAR" },
        maxActiveListings: Number(form.maxActiveListings),
        isActive: form.isActive,
      });
      setForm({ ...form, amount: "" });
      await reload();
      toast.success("Subscription plan created.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to create plan.");
    } finally {
      setSaving(false);
    }
  }
  async function update(plan: AdminRecord) {
    const id = idOf(plan);
    const price = window.prompt(
      "Price in QAR",
      String((plan.priceAmount as { amount?: number } | undefined)?.amount ?? ""),
    );
    const maxActiveListings = window.prompt(
      "Maximum active listings",
      String(plan.maxActiveListings ?? ""),
    );
    if (!id || price === null || maxActiveListings === null) return;
    try {
      await AdminRepository.updateSubscriptionPlan(id, {
        price: { amount: Number(price), minorAmount: 0, currencyCode: "QAR" },
        maxActiveListings: Number(maxActiveListings),
      });
      await reload();
      toast.success("Plan updated.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to update plan.");
    }
  }
  async function toggle(plan: AdminRecord) {
    const id = idOf(plan);
    if (!id) return;
    try {
      await AdminRepository.updateSubscriptionPlan(id, { isActive: !Boolean(plan.isActive) });
      await reload();
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to update plan.");
    }
  }
  async function remove(plan: AdminRecord) {
    const id = idOf(plan);
    if (!id || !window.confirm("Delete this plan?")) return;
    try {
      await AdminRepository.deleteSubscriptionPlan(id);
      setPlans((items) => items.filter((item) => idOf(item) !== id));
      toast.success("Plan deleted.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to delete plan.");
    }
  }
  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Subscription plans</h1>
        <p className="text-sm text-neutral-500">Plans for non-workforce agencies.</p>
      </div>
      <form onSubmit={create} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-3">
        <select
          value={form.agencyType}
          onChange={(event) => setForm({ ...form, agencyType: event.target.value })}
          className="rounded border p-2"
        >
          {agencyTypes.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <select
          value={form.duration}
          onChange={(event) => setForm({ ...form, duration: event.target.value })}
          className="rounded border p-2"
        >
          {durations.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <input
          required
          min="0"
          type="number"
          placeholder="Price (QAR)"
          value={form.amount}
          onChange={(event) => setForm({ ...form, amount: event.target.value })}
          className="rounded border p-2"
        />
        <input
          required
          min="1"
          type="number"
          placeholder="Max active listings"
          value={form.maxActiveListings}
          onChange={(event) => setForm({ ...form, maxActiveListings: event.target.value })}
          className="rounded border p-2"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
          />
          Active
        </label>
        <button
          disabled={saving}
          className="rounded bg-brand-800 px-4 py-2 text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Create plan"}
        </button>
      </form>
      <div className="overflow-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Agency type</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Price</th>
              <th className="p-3">Listings</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={idOf(plan)} className="border-b">
                <td className="p-3">{String(plan.agencyType)}</td>
                <td className="p-3">{String(plan.duration)}</td>
                <td className="p-3">
                  {String((plan.priceAmount as { amount?: number } | undefined)?.amount ?? "—")} QAR
                </td>
                <td className="p-3">{String(plan.maxActiveListings ?? "—")}</td>
                <td className="p-3">{Boolean(plan.isActive) ? "Active" : "Inactive"}</td>
                <td className="space-x-2 p-3">
                  <button onClick={() => void update(plan)}>Edit</button>
                  <button onClick={() => void toggle(plan)}>
                    {Boolean(plan.isActive) ? "Disable" : "Enable"}
                  </button>
                  <button className="text-red-700" onClick={() => void remove(plan)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
