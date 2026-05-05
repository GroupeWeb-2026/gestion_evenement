"use client";

import Link from "next/link";
import { Bell, LogOut, Search, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/events", label: "Événements" },
  { href: "/favorites", label: "Favoris" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  
  const isLoginPage = pathname === "/login";
  const showAdminUI = isLoggedIn && !isLoginPage;
  const isAdminActive = pathname === "/admin" || pathname.startsWith("/admin/");

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-brand-600">
          EventSync
        </Link>

        {/* Barre de recherche */}
        <div className="relative hidden flex-1 max-w-md md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un événement"
            className="input input-bordered h-10 w-full rounded-full border-gray-200 bg-gray-50 pl-9 text-sm focus:bg-white"
          />
        </div>

        {/* Navigation links */}
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative text-sm font-medium transition-colors px-4 py-6 -my-4 ${
                  active ? "text-brand-600" : "text-gray-700 hover:text-brand-600"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute -bottom-[1px] left-4 right-4 h-0.5 bg-brand-600 rounded-full" />
                )}
              </Link>
            );
          })}
          
          {/* Lien Admin avec zone cliquable large */}
          {showAdminUI && (
            <Link
              href="/admin"
              className={`relative text-sm font-medium transition-colors px-4 py-6 -my-4 ${
                isAdminActive ? "text-brand-600" : "text-gray-700 hover:text-brand-600"
              }`}
            >
              Admin
              {isAdminActive && (
                <span className="absolute -bottom-[1px] left-4 right-4 h-0.5 bg-brand-600 rounded-full" />
              )}
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button className="btn btn-ghost btn-circle btn-sm">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>

          {showAdminUI ? (
            <>
              <div className="flex items-center gap-1.5 rounded-full bg-gray-100 py-1 pl-1 pr-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                  {initials}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn btn-ghost btn-sm"
                aria-label="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link href="/login" className="btn btn-sm border-0 bg-brand-600 text-white hover:bg-brand-700">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}