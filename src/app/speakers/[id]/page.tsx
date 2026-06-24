import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { User, Calendar, Clock, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SpeakerPage({ params }: PageProps) {
  const { id } = await params;

  const speaker = await prisma.speaker.findUnique({
    where: { id },
    include: {
      sessions: {
        include: {
          session: {
            include: {
              event: true,
              room: true,
            },
          },
        },
      },
    },
  });

  if (!speaker) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Bannière avec photo et infos */}
          <div className="bg-gradient-to-r from-brand-600 to-brand-800 px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {speaker.photo ? (
                <img src={speaker.photo} alt={speaker.fullName} className="w-32 h-32 rounded-full border-4 border-white object-cover" />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white/20 flex items-center justify-center">
                  <User className="h-16 w-16" />
                </div>
              )}
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{speaker.fullName}</h1>
                {speaker.bio && <p className="mt-2 text-white/80 max-w-2xl">{speaker.bio}</p>}
                {speaker.externalLinks && (
                  <a href={speaker.externalLinks} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-sm text-white/80 hover:text-white transition">
                    <LinkIcon className="h-4 w-4" /> Profil professionnel
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Sessions associées */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sessions animées par {speaker.fullName.split(" ")[0]}</h2>
            {speaker.sessions.length === 0 && <p className="text-gray-500">Aucune session associée pour le moment.</p>}
            <div className="grid grid-cols-1 gap-4">
              {speaker.sessions.map(({ session }) => (
                <Link key={session.id} href={`/sessions/${session.id}`}>
                  <div className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition hover:border-brand-200">
                    <h3 className="font-medium text-gray-900">{session.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{session.event.title}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(session.startTime).toLocaleDateString("fr-FR")}</div>
                      <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(session.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - {new Date(session.endTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>
                      <div>📍 {session.room.name}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}