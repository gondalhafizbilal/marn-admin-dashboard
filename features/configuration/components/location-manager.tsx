"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminRepository, isAppApiError, type AdminRecord } from "@/services";

const idOf = (item: AdminRecord) => String(item.uuid ?? item.id ?? "");

export function LocationManager() {
  const [countries, setCountries] = useState<AdminRecord[]>([]);
  const [cities, setCities] = useState<AdminRecord[]>([]);
  const [country, setCountry] = useState({ name: "", code: "", isSupported: true });
  const [city, setCity] = useState({ name: "", countryId: "", isSupported: true });
  const reload = () =>
    Promise.all([AdminRepository.countries(), AdminRepository.cities()])
      .then(([nextCountries, nextCities]) => {
        setCountries(nextCountries);
        setCities(nextCities.data);
      })
      .catch((error) =>
        toast.error(isAppApiError(error) ? error.message : "Unable to load locations."),
      );
  useEffect(() => {
    void reload();
  }, []);
  async function createCountry(event: React.FormEvent) {
    event.preventDefault();
    try {
      await AdminRepository.createCountry({ ...country, code: country.code.toUpperCase() });
      setCountry({ name: "", code: "", isSupported: true });
      await reload();
      toast.success("Country created.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to create country.");
    }
  }
  async function createCity(event: React.FormEvent) {
    event.preventDefault();
    try {
      await AdminRepository.createCity(city);
      setCity({ name: "", countryId: "", isSupported: true });
      await reload();
      toast.success("City created.");
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to create city.");
    }
  }
  async function updateCountry(item: AdminRecord) {
    const name = window.prompt("Country name", String(item.name ?? ""));
    if (!name) return;
    try {
      await AdminRepository.updateCountry(idOf(item), { name });
      await reload();
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to update country.");
    }
  }
  async function updateCity(item: AdminRecord) {
    const name = window.prompt("City name", String(item.name ?? ""));
    if (!name) return;
    try {
      await AdminRepository.updateCity(idOf(item), { name });
      await reload();
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : "Unable to update city.");
    }
  }
  async function remove(item: AdminRecord, type: "country" | "city") {
    if (!window.confirm(`Delete this ${type}?`)) return;
    try {
      if (type === "country") await AdminRepository.deleteCountry(idOf(item));
      else await AdminRepository.deleteCity(idOf(item));
      await reload();
    } catch (error) {
      toast.error(isAppApiError(error) ? error.message : `Unable to delete ${type}.`);
    }
  }
  return (
    <section className="space-y-8 p-6">
      <div>
        <h1 className="text-xl font-semibold">Countries and cities</h1>
        <p className="text-sm text-neutral-500">Supported locations used across the platform.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-white p-4">
          <h2 className="font-medium">Countries</h2>
          <form onSubmit={createCountry} className="flex flex-wrap gap-2">
            <input
              required
              value={country.name}
              placeholder="Country name"
              onChange={(event) => setCountry({ ...country, name: event.target.value })}
              className="rounded border p-2"
            />
            <input
              required
              maxLength={2}
              value={country.code}
              placeholder="ISO code"
              onChange={(event) => setCountry({ ...country, code: event.target.value })}
              className="w-24 rounded border p-2"
            />
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={country.isSupported}
                onChange={(event) => setCountry({ ...country, isSupported: event.target.checked })}
              />
              Supported
            </label>
            <button className="rounded bg-brand-800 px-3 text-white">Add</button>
          </form>
          {countries.map((item) => (
            <div
              key={idOf(item)}
              className="flex items-center justify-between border-t py-2 text-sm"
            >
              <span>
                {String(item.name)} ({String(item.code)}) ·{" "}
                {item.isSupported ? "Supported" : "Hidden"}
              </span>
              <span className="space-x-2">
                <button onClick={() => void updateCountry(item)}>Edit</button>
                <button className="text-red-700" onClick={() => void remove(item, "country")}>
                  Delete
                </button>
              </span>
            </div>
          ))}
        </div>
        <div className="space-y-4 rounded-xl border bg-white p-4">
          <h2 className="font-medium">Cities</h2>
          <form onSubmit={createCity} className="flex flex-wrap gap-2">
            <input
              required
              value={city.name}
              placeholder="City name"
              onChange={(event) => setCity({ ...city, name: event.target.value })}
              className="rounded border p-2"
            />
            <select
              required
              value={city.countryId}
              onChange={(event) => setCity({ ...city, countryId: event.target.value })}
              className="rounded border p-2"
            >
              <option value="">Country</option>
              {countries.map((item) => (
                <option key={idOf(item)} value={idOf(item)}>
                  {String(item.name)}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={city.isSupported}
                onChange={(event) => setCity({ ...city, isSupported: event.target.checked })}
              />
              Supported
            </label>
            <button className="rounded bg-brand-800 px-3 text-white">Add</button>
          </form>
          {cities.map((item) => (
            <div
              key={idOf(item)}
              className="flex items-center justify-between border-t py-2 text-sm"
            >
              <span>
                {String(item.name)} · {item.isSupported ? "Supported" : "Hidden"}
              </span>
              <span className="space-x-2">
                <button onClick={() => void updateCity(item)}>Edit</button>
                <button className="text-red-700" onClick={() => void remove(item, "city")}>
                  Delete
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
