"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminRepository, isAppApiError, type AdminRecord } from "@/services";

const idOf = (item: AdminRecord) => String(item.uuid ?? item.id ?? "");

export function PushNotificationManager() {
  const [items, setItems] = useState<AdminRecord[]>([]);
  const [form, setForm] = useState({
    title: "",
    brief: "",
    message: "",
    priority: "medium",
    scheduledAt: "",
  });
  const reload = () =>
    AdminRepository.pushNotifications()
      .then(setItems)
      .catch((error) =>
        toast.error(isAppApiError(error) ? error.message : "Unable to load notifications."),
      );
  useEffect(() => {
    void reload();
  }, []);
  async function create(event: React.FormEvent) {
    event.preventDefault();
    try {
      await AdminRepository.createPushNotification({
        ...form,
        scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : undefined,
      });
      setForm({ title: "", brief: "", message: "", priority: "medium", scheduledAt: "" });
      await reload();
      toast.success("Notification created.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to create notification.");
    }
  }
  async function send(item: AdminRecord) {
    const receiverType = window.prompt("Receiver type", "allCustomer");
    if (!receiverType) return;
    try {
      await AdminRepository.sendPushNotification([idOf(item)], receiverType);
      await reload();
      toast.success("Notification queued.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to send notification.");
    }
  }
  async function stop(item: AdminRecord) {
    try {
      await AdminRepository.stopPushNotification(idOf(item));
      await reload();
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to stop notification.");
    }
  }
  async function remove(item: AdminRecord) {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await AdminRepository.deletePushNotification(idOf(item));
      setItems((current) => current.filter((value) => idOf(value) !== idOf(item)));
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to delete notification.");
    }
  }
  async function upload(item: AdminRecord, file?: File) {
    if (!file) return;
    try {
      await AdminRepository.uploadPushNotificationImage(idOf(item), file);
      toast.success("Image uploaded.");
      await reload();
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to upload image.");
    }
  }
  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Push notifications</h1>
        <p className="text-sm text-neutral-500">
          Create, schedule, send, and manage platform notifications.
        </p>
      </div>
      <form onSubmit={create} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2">
        <input
          required
          maxLength={100}
          placeholder="Title"
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          className="rounded border p-2"
        />
        <input
          required
          maxLength={160}
          placeholder="Brief"
          value={form.brief}
          onChange={(event) => setForm({ ...form, brief: event.target.value })}
          className="rounded border p-2"
        />
        <textarea
          required
          placeholder="Message"
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          className="rounded border p-2 md:col-span-2"
        />
        <select
          value={form.priority}
          onChange={(event) => setForm({ ...form, priority: event.target.value })}
          className="rounded border p-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="datetime-local"
          value={form.scheduledAt}
          onChange={(event) => setForm({ ...form, scheduledAt: event.target.value })}
          className="rounded border p-2"
        />
        <button className="rounded bg-brand-800 px-4 py-2 text-white">Create notification</button>
      </form>
      <div className="overflow-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={idOf(item)} className="border-b">
                <td className="p-3">
                  <p>{String(item.title)}</p>
                  <p className="text-neutral-500">{String(item.brief ?? "")}</p>
                </td>
                <td className="p-3">{String(item.status ?? "pending")}</td>
                <td className="space-x-2 p-3">
                  <button onClick={() => void send(item)}>Send</button>
                  <button onClick={() => void stop(item)}>Stop</button>
                  <label className="cursor-pointer">
                    Image
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => void upload(item, event.target.files?.[0])}
                    />
                  </label>
                  <button className="text-red-700" onClick={() => void remove(item)}>
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
