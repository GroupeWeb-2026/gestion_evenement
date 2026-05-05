"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";  // ← Redirige vers l'accueil
  const [email, setEmail] = useState("admin@eventsync.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      toast.error("Email ou mot de passe incorrect");
      return;
    }
    toast.success("Connexion réussie");
    router.push(callbackUrl);  // ← Redirige vers l'accueil
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-white p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <Link href="/" className="mb-6 flex items-center gap-2 text-brand-600">
          <span className="text-xl font-bold">EventSync</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
        <p className="mt-1 text-sm text-gray-500">
          Connectez-vous pour accéder à l'administration.
        </p>

        <div className="mt-4 rounded-lg border border-brand-200 bg-brand-50 p-3 text-xs text-brand-700">
          <p className="font-semibold">Compte administrateur :</p>
          <p>Email : <code>admin@eventsync.com</code></p>
          <p>Mot de passe : <code>admin123</code></p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </main>
  );
}