"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminRepository, isAppApiError, type AdminRecord } from "@/services";

const empty = { fullName: "", emailAddress: "", countryCode: "974", phoneNumber: "", password: "" };
const idOf = (value: AdminRecord) => String(value.uuid ?? value.id ?? "");

export function CustomerManagement() {
  const [customers, setCustomers] = useState<AdminRecord[]>([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const reload = () =>
    AdminRepository.customers()
      .then(setCustomers)
      .catch((e) => toast.error(isAppApiError(e) ? e.message : "Unable to load customers."))
      .finally(() => setLoading(false));
  useEffect(() => {
    void reload();
  }, []);
  async function create(event: FormEvent) {
    event.preventDefault();
    try {
      await AdminRepository.createCustomer(form);
      setForm(empty);
      await reload();
      toast.success("Customer created.");
    } catch (e) {
      toast.error(isAppApiError(e) ? e.message : "Unable to create customer.");
    }
  }
  async function remove(customer: AdminRecord) {
    if (!confirm("Delete this customer?")) return;
    try {
      await AdminRepository.deleteCustomer(idOf(customer));
      setCustomers((all) => all.filter((item) => idOf(item) !== idOf(customer)));
      toast.success("Customer deleted.");
    } catch (e) {
      toast.error(isAppApiError(e) ? e.message : "Unable to delete customer.");
    }
  }
  async function edit(customer: AdminRecord) {
    const fullName = prompt("Customer name", String(customer.fullName ?? ""));
    if (!fullName) return;
    await AdminRepository.updateCustomer(idOf(customer), { fullName });
    await reload();
  }
  async function updateEmail(customer: AdminRecord) {
    const emailAddress = prompt("Customer email", String(customer.emailAddress ?? ""));
    if (!emailAddress) return;
    await AdminRepository.updateCustomerEmail(idOf(customer), emailAddress);
    await reload();
  }
  async function updatePassword(customer: AdminRecord) {
    const password = prompt("New password (minimum 8 characters)");
    if (!password) return;
    await AdminRepository.updateCustomerPassword(idOf(customer), password);
    toast.success("Customer password updated.");
  }
  async function reactivate(customer: AdminRecord) {
    await AdminRepository.reactivateCustomer(String(customer.emailAddress ?? ""));
    await reload();
  }
  return (
    <div className="space-y-6 p-6">
      <form onSubmit={create} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-5">
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            required
            value={value}
            type={key === "password" ? "password" : key === "emailAddress" ? "email" : "text"}
            placeholder={key}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="rounded border p-2"
          />
        ))}
        <button className="rounded bg-brand-700 p-2 text-white">Create customer</button>
      </form>
      {loading ? (
        <p>Loading customers…</p>
      ) : (
        <div className="overflow-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr className="border-t" key={idOf(customer)}>
                  <td className="p-3">{String(customer.fullName ?? "—")}</td>
                  <td className="p-3">{String(customer.emailAddress ?? "—")}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => alert(JSON.stringify(customer, null, 2))}>
                      Details
                    </button>
                    <button onClick={() => void edit(customer)}>Edit</button>
                    <button onClick={() => void updateEmail(customer)}>Email</button>
                    <button onClick={() => void updatePassword(customer)}>Password</button>
                    <button onClick={() => void reactivate(customer)}>Reactivate</button>
                    <button className="text-red-700" onClick={() => void remove(customer)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
