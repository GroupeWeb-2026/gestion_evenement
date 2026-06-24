import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "EventHub — Découvrez et réservez vos événements",
  description:
    "Conférences, ateliers, concerts, festivals : trouvez et réservez votre place en quelques clics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="light">
      <body className="min-h-screen antialiased">
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
