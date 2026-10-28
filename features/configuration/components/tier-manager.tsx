"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminRepository, isAppApiError, type AdminRecord } from "@/services";

const names = ["vvvip", "vvip", "vip", "platinum", "gold", "silver", "bronze", "regular"];
const sections = ["sponsored_premium", "sponsored_band", "organic"];
const idOf = (item: AdminRecord) => String(item.uuid ?? item.id ?? "");

export function TierManager() {
  const [tiers, setTiers] = useState<AdminRecord[]>([]);
  const [form, setForm] = useState({
    name: names[0],
    section: sections[0],
    scope: "platform",
    slotCount: "",
    positionStart: "",
    positionEnd: "",
    price: "",
    durationDays: "30",
    description: "",
  });
  const reload = () =>
    AdminRepository.tiers()
      .then(setTiers)
      .catch((error) =>
        toast.error(isAppApiError(error) ? error.message : "Unable to load tiers."),
      );
  useEffect(() => {
    void reload();
  }, []);
  async function create(event: React.FormEvent) {
    event.preventDefault();
    try {
      await AdminRepository.createTier({
        name: form.name,
        section: form.section,
        scope: form.scope,
        slotCount: form.slotCount ? Number(form.slotCount) : null,
        positionStart: form.positionStart ? Number(form.positionStart) : null,
        positionEnd: form.positionEnd ? Number(form.positionEnd) : null,
        price: Number(form.price),
        currency: "QAR",
        durationDays: Number(form.durationDays),
        description: form.description || undefined,
      });
      await reload();
      toast.success("Tier created.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to create tier.");
    }
  }
  async function update(tier: AdminRecord) {
    const price = window.prompt("Price in QAR", String(tier.price ?? ""));
    const durationDays = window.prompt("Duration in days", String(tier.durationDays ?? ""));
    if (price === null || durationDays === null) return;
    try {
      await AdminRepository.updateTier(idOf(tier), {
        price: Number(price),
        durationDays: Number(durationDays),
      });
      await reload();
      toast.success("Tier updated.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to update tier.");
    }
  }
  async function setPromotion(tier: AdminRecord) {
    const promoPrice = window.prompt("Promo price in QAR", String(tier.promoPrice ?? ""));
    const promoExpiresAt = window.prompt(
      "Promo expiry (YYYY-MM-DD)",
      String(tier.promoExpiresAt ?? "").slice(0, 10),
    );
    if (!promoPrice || !promoExpiresAt) return;
    try {
      await AdminRepository.setTierPromo(idOf(tier), {
        promoPrice: Number(promoPrice),
        promoExpiresAt,
      });
      await reload();
      toast.success("Promotion saved.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to save promotion.");
    }
  }
  async function removePromotion(tier: AdminRecord) {
    try {
      await AdminRepository.removeTierPromo(idOf(tier));
      await reload();
      toast.success("Promotion removed.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to remove promotion.");
    }
  }
  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Listing tiers</h1>
        <p className="text-sm text-neutral-500">
          Control placement inventory, duration, pricing, and promotions.
        </p>
      </div>
      <form onSubmit={create} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-3">
        <select
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          className="rounded border p-2"
        >
          {names.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <select
          value={form.section}
          onChange={(event) => setForm({ ...form, section: event.target.value })}
          className="rounded border p-2"
        >
          {sections.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <select
          value={form.scope}
          onChange={(event) => setForm({ ...form, scope: event.target.value })}
          className="rounded border p-2"
        >
          <option value="platform">platform</option>
          <option value="category">category</option>
        </select>
        <input
          type="number"
          min="1"
          placeholder="Slot count"
          value={form.slotCount}
          onChange={(event) => setForm({ ...form, slotCount: event.target.value })}
          className="rounded border p-2"
        />
        <input
          type="number"
          min="0"
          required
          placeholder="Price QAR"
          value={form.price}
          onChange={(event) => setForm({ ...form, price: event.target.value })}
          className="rounded border p-2"
        />
        <input
          type="number"
          min="1"
          required
          placeholder="Duration days"
          value={form.durationDays}
          onChange={(event) => setForm({ ...form, durationDays: event.target.value })}
          className="rounded border p-2"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          className="rounded border p-2 md:col-span-2"
        />
        <button className="rounded bg-brand-800 px-4 py-2 text-white">Create tier</button>
      </form>
      <div className="overflow-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Tier</th>
              <th className="p-3">Placement</th>
              <th className="p-3">Price</th>
              <th className="p-3">Promo</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier) => (
              <tr key={idOf(tier)} className="border-b">
                <td className="p-3">{String(tier.name)}</td>
                <td className="p-3">
                  {String(tier.section)} · {String(tier.scope)}
                </td>
                <td className="p-3">
                  {String(tier.price)} {String(tier.currency ?? "QAR")} /{" "}
                  {String(tier.durationDays)} days
                </td>
                <td className="p-3">
                  {tier.promoActive
                    ? `${String(tier.promoPrice)} until ${String(tier.promoExpiresAt).slice(0, 10)}`
                    : "—"}
                </td>
                <td className="space-x-2 p-3">
                  <button onClick={() => void update(tier)}>Edit</button>
                  <button onClick={() => void setPromotion(tier)}>Set promo</button>
                  {tier.promoActive ? (
                    <button onClick={() => void removePromotion(tier)}>Remove promo</button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
