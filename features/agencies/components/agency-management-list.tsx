"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminRepository, isAppApiError, type AdminRecord, type AgencyDocument } from "@/services";

const agencyId = (agency: AdminRecord) => String(agency.uuid ?? agency.id ?? "");

type AgencyDetails = { agency: AdminRecord; documents: AgencyDocument[] };

/** Live agency moderation, profile review, and document verification. */
export function AgencyManagementList() {
  const [agencies, setAgencies] = useState<AdminRecord[]>([]);
  const [details, setDetails] = useState<AgencyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const reload = async () => {
    setLoading(true);
    try {
      setAgencies(await AdminRepository.agencies());
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to load agencies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const statuses = useMemo(
    () => [...new Set(agencies.map((agency) => String(agency.status ?? "")).filter(Boolean))],
    [agencies],
  );
  const filteredAgencies = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return agencies.filter((agency) => {
      const matchesStatus = statusFilter === "all" || agency.status === statusFilter;
      const matchesQuery =
        !normalized ||
        [agency.agency_name, agency.emailAddress, agency.phoneNumber].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(normalized),
        );
      return matchesStatus && matchesQuery;
    });
  }, [agencies, query, statusFilter]);

  async function showDetails(agency: AdminRecord) {
    const id = agencyId(agency);
    if (!id) return;
    setLoadingDetails(true);
    try {
      const [fullAgency, documents] = await Promise.all([
        AdminRepository.agency(id),
        AdminRepository.agencyDocuments(id),
      ]);
      setDetails({ agency: fullAgency, documents });
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to load agency details.");
    } finally {
      setLoadingDetails(false);
    }
  }

  function replaceAgency(updated: AdminRecord) {
    const id = agencyId(updated);
    setAgencies((current) => current.map((item) => (agencyId(item) === id ? updated : item)));
    setDetails((current) =>
      current && agencyId(current.agency) === id ? { ...current, agency: updated } : current,
    );
  }

  async function changeStatus(agency: AdminRecord, status: string) {
    const id = agencyId(agency);
    if (!id) return;
    try {
      replaceAgency(await AdminRepository.updateAgencyStatus(id, status));
      toast.success("Agency status updated.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to update status.");
    }
  }

  async function updateEmail(agency: AdminRecord) {
    const id = agencyId(agency);
    const emailAddress = window.prompt("Agency email", String(agency.emailAddress ?? ""));
    if (!id || !emailAddress) return;
    try {
      replaceAgency(await AdminRepository.updateAgencyEmail(id, emailAddress));
      toast.success("Agency email updated.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to update email.");
    }
  }

  async function verifyDocument(document: AgencyDocument, verified: boolean) {
    try {
      const updated = await AdminRepository.verifyAgencyDocument(document.uuid, verified);
      setDetails((current) =>
        current
          ? {
              ...current,
              documents: current.documents.map((item) =>
                item.uuid === document.uuid ? updated : item,
              ),
            }
          : current,
      );
      toast.success(verified ? "Document verified." : "Document verification removed.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to update document.");
    }
  }

  async function removeAgency(agency: AdminRecord) {
    const id = agencyId(agency);
    if (!id || !window.confirm("Deactivate this agency?")) return;
    try {
      await AdminRepository.deleteAgency(id);
      setAgencies((current) => current.filter((item) => agencyId(item) !== id));
      if (details && agencyId(details.agency) === id) setDetails(null);
      toast.success("Agency deactivated.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to deactivate agency.");
    }
  }

  if (loading) return <p className="p-6 text-sm text-neutral-500">Loading agencies…</p>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search agencies"
          className="rounded border px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded border px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="rounded border px-3 py-2 text-sm"
          onClick={() => void reload()}
        >
          Refresh
        </button>
      </div>
      {filteredAgencies.length ? (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-neutral-500">
              <tr>
                <th className="p-3">Agency</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgencies.map((agency) => (
                <tr key={agencyId(agency)} className="border-t border-neutral-100">
                  <td className="p-3">{String(agency.agency_name ?? agency.name ?? "—")}</td>
                  <td className="p-3">{String(agency.emailAddress ?? "—")}</td>
                  <td className="p-3 capitalize">
                    {String(agency.status ?? "—").replaceAll("_", " ")}
                  </td>
                  <td className="flex flex-wrap gap-2 p-3">
                    <button className="text-brand-700" onClick={() => void showDetails(agency)}>
                      Details
                    </button>
                    <button
                      className="text-emerald-700"
                      onClick={() => void changeStatus(agency, "active")}
                    >
                      Activate
                    </button>
                    <button
                      className="text-amber-700"
                      onClick={() => void changeStatus(agency, "suspended")}
                    >
                      Suspend
                    </button>
                    <button className="text-brand-700" onClick={() => void updateEmail(agency)}>
                      Email
                    </button>
                    <button className="text-red-700" onClick={() => void removeAgency(agency)}>
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="p-6 text-sm text-neutral-500">No agencies found.</p>
      )}
      {loadingDetails ? <p className="text-sm text-neutral-500">Loading agency details…</p> : null}
      {details ? (
        <section className="space-y-4 rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">
                {String(details.agency.agency_name ?? details.agency.name ?? "Agency")}
              </h2>
              <p className="text-sm text-neutral-500">
                {String(details.agency.emailAddress ?? "")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDetails(null)}
              className="text-sm text-neutral-600"
            >
              Close
            </button>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Documents</h3>
            {details.documents.length ? (
              <div className="space-y-2">
                {details.documents.map((document) => (
                  <div
                    key={document.uuid}
                    className="flex flex-wrap items-center justify-between gap-3 rounded border p-3 text-sm"
                  >
                    <span>
                      {document.file_name ?? document.doc_type ?? "Document"} ·{" "}
                      {document.verified ? "Verified" : "Pending"}
                    </span>
                    <span className="flex gap-2">
                      {document.file_url ? (
                        <a
                          className="text-brand-700"
                          href={document.file_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      ) : null}
                      <button
                        className="text-emerald-700"
                        onClick={() => void verifyDocument(document, true)}
                      >
                        Verify
                      </button>
                      <button
                        className="text-amber-700"
                        onClick={() => void verifyDocument(document, false)}
                      >
                        Unverify
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">No documents uploaded.</p>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
