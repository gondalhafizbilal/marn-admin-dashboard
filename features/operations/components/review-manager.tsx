"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminRepository, isAppApiError, type AdminRecord } from "@/services";

const idOf = (item: AdminRecord) => String(item.uuid ?? item.id ?? "");

export function ReviewManager() {
  const [agencyId, setAgencyId] = useState("");
  const [reviews, setReviews] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(false);
  async function load(event?: React.FormEvent) {
    event?.preventDefault();
    if (!agencyId) return;
    setLoading(true);
    try {
      const response = await AdminRepository.reviews(agencyId);
      setReviews(response.data);
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }
  async function edit(item: AdminRecord) {
    const comment = window.prompt("Review comment", String(item.comment ?? ""));
    if (comment === null) return;
    try {
      const updated = await AdminRepository.updateReview(agencyId, idOf(item), { comment });
      setReviews((current) =>
        current.map((value) => (idOf(value) === idOf(item) ? updated : value)),
      );
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to update review.");
    }
  }
  async function remove(item: AdminRecord) {
    if (!window.confirm("Delete this review?")) return;
    try {
      await AdminRepository.deleteReview(agencyId, idOf(item));
      setReviews((current) => current.filter((value) => idOf(value) !== idOf(item)));
      toast.success("Review deleted.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to delete review.");
    }
  }
  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Agency reviews</h1>
        <p className="text-sm text-neutral-500">
          Enter an agency UUID to load and moderate its reviews.
        </p>
      </div>
      <form onSubmit={(event) => void load(event)} className="flex max-w-2xl gap-2">
        <input
          required
          value={agencyId}
          onChange={(event) => setAgencyId(event.target.value)}
          placeholder="Agency UUID"
          className="min-w-0 flex-1 rounded border p-2"
        />
        <button className="rounded bg-brand-800 px-4 text-white">Load</button>
      </form>
      {loading ? <p className="text-sm text-neutral-500">Loading reviews…</p> : null}
      <div className="space-y-3">
        {reviews.map((review) => (
          <article key={idOf(review)} className="rounded-xl border bg-white p-4">
            <div className="flex justify-between gap-4">
              <div>
                <p className="font-medium">{String(review.rating ?? "—")} / 5</p>
                <p className="mt-1 text-sm">{String(review.comment ?? "No comment")}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => void edit(review)}>Edit</button>
                <button className="text-red-700" onClick={() => void remove(review)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
