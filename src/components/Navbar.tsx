"use client";

import Link from "next/link";
import { Bell, LogOut, Search, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

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

  // Ref pour chaque élément de navigation
  const homeRef = useRef<HTMLAnchorElement>(null);
  const eventsRef = useRef<HTMLAnchorElement>(null);
  const favoritesRef = useRef<HTMLAnchorElement>(null);
  const adminRef = useRef<HTMLAnchorElement>(null);

  // État pour la position et la largeur du tiret
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    let activeRef = null;
    if (pathname === "/") activeRef = homeRef.current;
    else if (pathname === "/events") activeRef = eventsRef.current;
    else if (pathname === "/favorites") activeRef = favoritesRef.current;
    else if (showAdminUI && (pathname === "/admin" || pathname.startsWith("/admin/"))) activeRef = adminRef.current;

    if (activeRef) {
      const { offsetLeft, offsetWidth } = activeRef;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [pathname, showAdminUI]);

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

        {/* Navigation links avec tiret glissant */}
        <nav className="relative hidden items-center gap-2 md:flex">
          <Link
            ref={homeRef}
            href="/"
            className={`relative text-sm font-medium transition-colors px-4 py-6 -my-4 ${
              pathname === "/" ? "text-brand-600" : "text-gray-700 hover:text-brand-600"
            }`}
          >
            Accueil
          </Link>
          <Link
            ref={eventsRef}
            href="/events"
            className={`relative text-sm font-medium transition-colors px-4 py-6 -my-4 ${
              pathname === "/events" ? "text-brand-600" : "text-gray-700 hover:text-brand-600"
            }`}
          >
            Événements
          </Link>
          <Link
            ref={favoritesRef}
            href="/favorites"
            className={`relative text-sm font-medium transition-colors px-4 py-6 -my-4 ${
              pathname === "/favorites" ? "text-brand-600" : "text-gray-700 hover:text-brand-600"
            }`}
          >
            Favoris
          </Link>
          {showAdminUI && (
            <Link
              ref={adminRef}
              href="/admin"
              className={`relative text-sm font-medium transition-colors px-4 py-6 -my-4 ${
                isAdminActive ? "text-brand-600" : "text-gray-700 hover:text-brand-600"
              }`}
            >
              Admin
            </Link>
          )}

          {/* Tiret glissant */}
          <span
            className="absolute -bottom-[15px] h-1 bg-brand-600 rounded-full transition-all duration-300 ease-out"
            style={{ left: underlineStyle.left, width: underlineStyle.width }}
          />
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