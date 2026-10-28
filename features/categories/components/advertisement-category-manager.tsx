"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { CategoryRepository, isAppApiError } from "@/services";
import type { CategoryTreeNode } from "@/features/categories";

function flatten(
  nodes: CategoryTreeNode[],
  depth = 0,
): Array<CategoryTreeNode & { depth: number }> {
  return nodes.flatMap((node) => [{ ...node, depth }, ...flatten(node.children ?? [], depth + 1)]);
}

export function AdvertisementCategoryManager() {
  const [tree, setTree] = useState<CategoryTreeNode[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentUuid, setParentUuid] = useState("");
  const reload = () =>
    CategoryRepository.findTree()
      .then(setTree)
      .catch((error) =>
        toast.error(isAppApiError(error) ? error.message : "Unable to load categories."),
      );
  useEffect(() => {
    void reload();
  }, []);
  const items = useMemo(() => flatten(tree), [tree]);
  async function create(event: React.FormEvent) {
    event.preventDefault();
    try {
      await CategoryRepository.create({
        name,
        description: description || null,
        parentUuid: parentUuid || null,
      });
      setName("");
      setDescription("");
      setParentUuid("");
      await reload();
      toast.success("Category created.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to create category.");
    }
  }
  async function edit(item: CategoryTreeNode) {
    const next = window.prompt("Category name", item.name);
    if (!next) return;
    try {
      await CategoryRepository.update(item.uuid, { name: next });
      await reload();
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to update category.");
    }
  }
  async function remove(item: CategoryTreeNode) {
    if (!window.confirm("Delete this category?")) return;
    try {
      await CategoryRepository.remove(item.uuid);
      await reload();
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to delete category.");
    }
  }
  async function reorderRoot() {
    const roots = tree.map((item) => item.uuid);
    if (!roots.length) return;
    try {
      await CategoryRepository.reorder(roots);
      toast.success("Root category order saved.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to save order.");
    }
  }
  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Advertisement categories</h1>
        <p className="text-sm text-neutral-500">Manage the public advertisement category tree.</p>
      </div>
      <form onSubmit={create} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2">
        <input
          required
          placeholder="Category name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded border p-2"
        />
        <select
          value={parentUuid}
          onChange={(event) => setParentUuid(event.target.value)}
          className="rounded border p-2"
        >
          <option value="">Root category</option>
          {items.map((item) => (
            <option key={item.uuid} value={item.uuid}>
              {"— ".repeat(item.depth)}
              {item.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="rounded border p-2"
        />
        <div className="flex gap-2">
          <button className="rounded bg-brand-800 px-4 text-white">Add category</button>
          <button type="button" onClick={() => void reorderRoot()} className="rounded border px-4">
            Save root order
          </button>
        </div>
      </form>
      <div className="rounded-xl border bg-white">
        {items.map((item) => (
          <div key={item.uuid} className="flex items-center justify-between border-b p-3 text-sm">
            <span style={{ paddingInlineStart: `${item.depth * 20}px` }}>{item.name}</span>
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
