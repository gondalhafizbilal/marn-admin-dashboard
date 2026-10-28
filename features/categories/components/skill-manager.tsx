"use client";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminRepository, isAppApiError, type AdminRecord } from "@/services";
const idOf = (x: AdminRecord) => String(x.uuid ?? x.id ?? "");
export function SkillManager() {
  const [items, setItems] = useState<AdminRecord[]>([]);
  const [categories, setCategories] = useState<AdminRecord[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryUuids, setCategoryUuids] = useState("");
  const reload = () =>
    Promise.all([AdminRepository.skills(), AdminRepository.workforceCategories()])
      .then(([skills, cats]) => {
        setItems(skills);
        setCategories(cats);
      })
      .catch((e) => toast.error(isAppApiError(e) ? e.message : "Unable to load skills."));
  useEffect(() => {
    void reload();
  }, []);
  const ids = () =>
    categoryUuids
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      await AdminRepository.createSkill({
        name,
        description: description || null,
        categoryUuids: ids(),
      });
      setName("");
      setDescription("");
      setCategoryUuids("");
      await reload();
      toast.success("Skill created.");
    } catch (err) {
      toast.error(isAppApiError(err) ? err.message : "Unable to create skill.");
    }
  }
  async function edit(item: AdminRecord) {
    const next = prompt("Skill name", String(item.name ?? ""));
    if (!next) return;
    await AdminRepository.updateSkill(idOf(item), { name: next });
    await reload();
  }
  async function remove(item: AdminRecord) {
    if (!confirm("Delete this skill?")) return;
    await AdminRepository.deleteSkill(idOf(item));
    await reload();
  }
  return (
    <section className="space-y-5 p-6">
      <form onSubmit={submit} className="flex flex-wrap gap-2">
        <input
          required
          className="rounded border p-2"
          placeholder="Skill name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="rounded border p-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          required
          className="min-w-80 rounded border p-2"
          placeholder="Workforce category UUIDs, comma-separated"
          value={categoryUuids}
          onChange={(e) => setCategoryUuids(e.target.value)}
        />
        <button className="rounded bg-brand-700 px-3 text-white">Add skill</button>
      </form>
      <p className="text-xs text-neutral-500">
        Available workforce categories:{" "}
        {categories.map((x) => `${x.name ?? "Category"} (${idOf(x)})`).join(", ")}
      </p>
      <div className="rounded-xl border bg-white">
        {items.map((item) => (
          <div key={idOf(item)} className="flex justify-between border-b p-3">
            <span>{String(item.name ?? "Untitled")}</span>
            <span className="space-x-3">
              <button onClick={() => void edit(item)}>Edit</button>
              <button className="text-red-700" onClick={() => void remove(item)}>
                Delete
              </button>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
