"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminRepository, isAppApiError, type AdminRecord } from "@/services";

const idOf = (record: AdminRecord) => String(record.uuid ?? record.id ?? "");

export function AgencyCategoryManager() {
  const [items, setItems] = useState<AdminRecord[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const reload = () =>
    AdminRepository.agencyCategoryTree()
      .then(setItems)
      .catch((e) =>
        toast.error(isAppApiError(e) ? e.message : "Unable to load agency categories."),
      );
  useEffect(() => {
    void reload();
  }, []);
  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      await AdminRepository.createAgencyCategory({ name, description: description || null });
      setName("");
      setDescription("");
      await reload();
      toast.success("Category created.");
    } catch (err) {
      toast.error(isAppApiError(err) ? err.message : "Unable to create category.");
    }
  }
  async function edit(item: AdminRecord) {
    const next = prompt("Category name", String(item.name ?? ""));
    if (!next) return;
    try {
      await AdminRepository.updateAgencyCategory(idOf(item), { name: next });
      await reload();
    } catch (err) {
      toast.error(isAppApiError(err) ? err.message : "Unable to update category.");
    }
  }
  async function remove(item: AdminRecord) {
    if (!confirm("Delete this category?")) return;
    try {
      await AdminRepository.deleteAgencyCategory(idOf(item));
      await reload();
    } catch (err) {
      toast.error(isAppApiError(err) ? err.message : "Unable to delete category.");
    }
  }
  async function reorder() {
    try {
      await AdminRepository.reorderAgencyCategories({ orderedUuids: items.map(idOf) });
      toast.success("Category order saved.");
    } catch (err) {
      toast.error(isAppApiError(err) ? err.message : "Unable to reorder categories.");
    }
  }
  return (
    <section className="space-y-5 p-6">
      <form onSubmit={submit} className="flex flex-wrap gap-2">
        <input
          required
          className="rounded border p-2"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="rounded border p-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="rounded bg-brand-700 px-3 text-white">Add category</button>
        <button type="button" className="rounded border px-3" onClick={() => void reorder()}>
          Save current order
        </button>
      </form>
      <div className="rounded-xl border bg-white">
        {items.map((item) => (
          <div key={idOf(item)} className="flex items-center justify-between border-b p-3">
            <span>{String(item.name ?? "Untitled")}</span>
            <div className="flex gap-3">
              <button onClick={() => void edit(item)}>Edit</button>
              <button className="text-red-700" onClick={() => void remove(item)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
