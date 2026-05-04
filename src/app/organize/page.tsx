import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function OrganizePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Organiser un événement
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Bientôt disponible : créez et publiez vos propres événements.
        </p>
      </main>
      <Footer />
    </div>
  );
}
