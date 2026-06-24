import { Bird, Book, Camera, LucideLink } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-xs text-gray-500">© 2026 EventHub. Tous droits réservés.</p>
        <nav className="flex items-center gap-5 text-xs text-gray-600">
          <Link href="#">À propos</Link>
          <Link href="#">Conditions d&apos;utilisation</Link>
          <Link href="#">Confidentialité</Link>
          <Link href="#">Contact</Link>
        </nav>
        <div className="flex items-center gap-3 text-gray-500">
          <Book className="h-4 w-4" />
          <Camera className="h-4 w-4" />
          <LucideLink className="h-4 w-4" />
          <Bird className="h-4 w-4" />
        </div>
      </div>
    </footer>
  );
}
