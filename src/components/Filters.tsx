"use client";

import { Calendar, MapPin, RotateCcw, Tag, Wallet } from "lucide-react";

export function Filters() {
  return (
    <aside className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <h3 className="text-base font-semibold text-gray-900">Filtres</h3>
      <div className="mt-4 space-y-4">
        <SelectRow label="Catégorie" icon={<Tag className="h-4 w-4" />} placeholder="Toutes les catégories" />
        <InputRow label="Date" icon={<Calendar className="h-4 w-4" />} placeholder="Sélectionner une date" />
        <SelectRow label="Prix" icon={<Wallet className="h-4 w-4" />} placeholder="Tous les prix" />
        <SelectRow label="Lieu" icon={<MapPin className="h-4 w-4" />} placeholder="Tous les lieux" />
      </div>
      <button className="btn btn-outline mt-5 w-full gap-2 border-brand-600 text-brand-600 hover:border-brand-700 hover:bg-brand-50 hover:text-brand-700">
        <RotateCcw className="h-4 w-4" /> Réinitialiser
      </button>
    </aside>
  );
}

function SelectRow({ label, icon, placeholder }: { label: string; icon: React.ReactNode; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-gray-600">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <select defaultValue="" className="select select-bordered h-10 w-full border-gray-200 bg-gray-50 pl-9 text-sm font-normal text-gray-500">
          <option value="" disabled>{placeholder}</option>
        </select>
      </div>
    </label>
  );
}
function InputRow({ label, icon, placeholder }: { label: string; icon: React.ReactNode; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-gray-600">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input type="text" placeholder={placeholder} className="input input-bordered h-10 w-full border-gray-200 bg-gray-50 pl-9 text-sm" />
      </div>
    </label>
  );
}
