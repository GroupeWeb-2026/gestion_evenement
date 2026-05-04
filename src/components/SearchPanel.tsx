"use client";

import { Search, MapPin, Calendar, Tag } from "lucide-react";

export function SearchPanel() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-2xl">
      <h3 className="text-lg font-semibold text-gray-900">Trouver un événement</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Rechercher" icon={<Search className="h-4 w-4" />} placeholder="Ex: Conférence, Concert, Atelier..." />
        <Field label="Lieu" icon={<MapPin className="h-4 w-4" />} placeholder="Ville ou lieu" />
        <SelectField label="Date" icon={<Calendar className="h-4 w-4" />} placeholder="Sélectionner une date" />
        <SelectField label="Catégorie" icon={<Tag className="h-4 w-4" />} placeholder="Toutes les catégories" />
      </div>
      <button className="btn mt-4 w-full rounded-lg border-0 bg-brand-600 text-white hover:bg-brand-700">
        Rechercher
      </button>
    </div>
  );
}

function Field({ label, icon, placeholder }: { label: string; icon: React.ReactNode; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-gray-600">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          type="text"
          placeholder={placeholder}
          className="input input-bordered h-10 w-full border-gray-200 bg-gray-50 pl-9 text-sm focus:bg-white"
        />
      </div>
    </label>
  );
}

function SelectField({ label, icon, placeholder }: { label: string; icon: React.ReactNode; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-gray-600">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <select
          defaultValue=""
          className="select select-bordered h-10 w-full border-gray-200 bg-gray-50 pl-9 text-sm font-normal text-gray-500 focus:bg-white"
        >
          <option value="" disabled>
            {placeholder}
          </option>
        </select>
      </div>
    </label>
  );
}
