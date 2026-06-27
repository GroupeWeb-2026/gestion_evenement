import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar, Heart, Mail, User } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      registrations: {
        include: { event: true },
        orderBy: { createdAt: "desc" },
      },
      favorites: {
        include: { event: true, session: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* En-tête profil */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-white">
              {user.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <span className={`mt-2 inline-block text-xs font-medium px-2 py-1 rounded-full ${
                user.role === "ADMIN"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {user.role === "ADMIN" ? "Administrateur" : "Utilisateur"}
              </span>
            </div>
          </div>
        </div>

        {/* Mes inscriptions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand-600" />
            Mes inscriptions ({user.registrations.length})
          </h2>

          {user.registrations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Vous n'êtes inscrit à aucun événement.</p>
              <Link href="/events" className="mt-3 inline-block text-brand-600 hover:underline text-sm">
                Explorer les événements
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {user.registrations.map((reg) => (
                <Link key={reg.id} href={`/events/${reg.event.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                    <div>
                      <h3 className="font-medium text-gray-900">{reg.event.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(reg.event.dateStart).toLocaleDateString("fr-FR")} - {new Date(reg.event.dateEnd).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <span className="text-xs text-brand-600 font-medium">Voir →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Mes favoris */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Mes favoris ({user.favorites.length})
          </h2>

          {user.favorites.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun favori pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {user.favorites.map((fav) => (
                <Link
                  key={fav.id}
                  href={fav.event ? `/events/${fav.event.id}` : `/sessions/${fav.session?.id}`}
                >
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                    <div>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 mb-1 inline-block">
                        {fav.event ? "Événement" : "Session"}
                      </span>
                      <h3 className="font-medium text-gray-900">
                        {fav.event ? fav.event.title : fav.session?.title}
                      </h3>
                    </div>
                    <span className="text-xs text-brand-600 font-medium">Voir →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}