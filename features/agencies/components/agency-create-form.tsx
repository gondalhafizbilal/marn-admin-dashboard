"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useRouter } from "@/i18n/navigation";
import { AdminRepository, isAppApiError } from "@/services";

const agencyTypes = [
  "housemaid",
  "housemaid_local",
  "hajj_umrah",
  "events",
  "services",
  "car_services",
  "laundry_services",
  "home_projects",
] as const;

const initialValues = {
  agencyName: "",
  emailAddress: "",
  countryCode: "974",
  phoneNumber: "",
  password: "",
  agencyType: agencyTypes[0],
  about: "",
};

/** Admin-only agency creation form backed by POST /agencies. */
export function AgencyCreateForm() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await AdminRepository.createAgency({ ...values, about: values.about || undefined });
      toast.success("Agency created.");
      router.replace("/agencies");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to create agency.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-sm"
    >
      <div>
        <h1 className="text-xl font-semibold">Create agency</h1>
        <p className="text-sm text-neutral-500">Create an agency account and onboarding record.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          Agency name
          <input
            required
            value={values.agencyName}
            onChange={(event) => setValues({ ...values, agencyName: event.target.value })}
            className="rounded border p-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Email
          <input
            required
            type="email"
            value={values.emailAddress}
            onChange={(event) => setValues({ ...values, emailAddress: event.target.value })}
            className="rounded border p-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Country code
          <input
            required
            value={values.countryCode}
            onChange={(event) => setValues({ ...values, countryCode: event.target.value })}
            className="rounded border p-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Phone number
          <input
            required
            value={values.phoneNumber}
            onChange={(event) => setValues({ ...values, phoneNumber: event.target.value })}
            className="rounded border p-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Temporary password
          <input
            required
            minLength={8}
            type="password"
            value={values.password}
            onChange={(event) => setValues({ ...values, password: event.target.value })}
            className="rounded border p-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Agency type
          <select
            value={values.agencyType}
            onChange={(event) =>
              setValues({ ...values, agencyType: event.target.value as typeof values.agencyType })
            }
            className="rounded border p-2"
          >
            {agencyTypes.map((type) => (
              <option key={type} value={type}>
                {type.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          About
          <textarea
            value={values.about}
            onChange={(event) => setValues({ ...values, about: event.target.value })}
            className="min-h-24 rounded border p-2"
          />
        </label>
      </div>
      <div className="flex gap-3">
        <button
          disabled={saving}
          className="rounded bg-brand-800 px-4 py-2 text-white disabled:opacity-60"
        >
          {saving ? "Creating…" : "Create agency"}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded border px-4 py-2">
          Cancel
        </button>
      </div>
    </form>
  );
}
