import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ReservationsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Mes réservations</h1>
        <p className="mt-2 text-sm text-gray-600">
          Connectez-vous pour voir vos réservations.
        </p>
      </main>
      <Footer />
    </div>
  );
}
