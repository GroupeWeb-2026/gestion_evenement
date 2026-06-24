"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Erreur lors de l'inscription");
      return;
    }
    toast.success("Compte créé avec succès !");
    router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-white p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <Link href="/" className="mb-6 flex items-center gap-2 text-brand-600">
          <span className="text-xl font-bold">EventSync</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
        <p className="mt-1 text-sm text-gray-500">
          Rejoignez EventSync pour accéder aux événements.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Nom</span>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered h-11 w-full rounded-lg border-gray-200 pl-10"
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered h-11 w-full rounded-lg border-gray-200 pl-10"
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Mot de passe</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered h-11 w-full rounded-lg border-gray-200 pl-10"
              />
            </div>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="btn h-11 w-full rounded-lg border-0 bg-brand-600 text-white hover:bg-brand-700"
          >
            {loading ? "Inscription..." : "Créer un compte"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-brand-600 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}