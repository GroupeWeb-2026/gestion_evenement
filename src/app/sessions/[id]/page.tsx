import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isLive } from "@/lib/isLive";
import { QuestionForm } from "@/components/questions/QuestionForm";
import { QuestionList } from "@/components/questions/QuestionList";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Calendar, Clock, MapPin, User, Users } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function revalidatePage(path: string) {
  "use server";
  const { revalidatePath } = await import("next/cache");
  revalidatePath(path);
}

export default async function SessionDetailPage({ params }: PageProps) {
  const { id } = await params;

  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      room: true,
      event: true,
      speakers: { include: { speaker: true } },
      questions: { orderBy: { upvotes: "desc" } },
    },
  });

  if (!session) notFound();

  const live = isLive(session.startTime, session.endTime);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Fil d'Ariane */}
        <div className="text-sm text-gray-500 mb-4">
          <Link href={`/events/${session.eventId}`} className="hover:text-brand-600">
            {session.event.title}
          </Link>
          {" > "}
          <span className="text-gray-900">{session.title}</span>
        </div>

        {/* En-tête avec bouton favori */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{session.title}</h1>
                {live && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                    🔴 LIVE
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{session.description}</p>
            </div>
            <FavoriteButton sessionId={session.id} sessionTitle={session.title} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(session.startTime).toLocaleDateString("fr-FR")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {new Date(session.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} -{" "}
                {new Date(session.endTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{session.room.name}</span>
            </div>
            {session.capacity && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Capacité : {session.capacity} personnes</span>
              </div>
            )}
          </div>
        </div>

        {/* Speakers */}
        {session.speakers.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Intervenants
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {session.speakers.map(({ speaker }) => (
                <Link key={speaker.id} href={`/speakers/${speaker.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                    {speaker.photo ? (
                      <img
                        src={speaker.photo}
                        alt={speaker.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-brand-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{speaker.fullName}</p>
                      {speaker.bio && (
                        <p className="text-xs text-gray-500 line-clamp-1">{speaker.bio}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Questions/Réponses */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">💬 Questions & Réponses</h2>

          {!live && (
            <div className="bg-gray-100 rounded-lg p-4 text-center mb-4">
              <p className="text-gray-600">
                ⏳ Les questions seront ouvertes lorsque la session sera en cours.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Début : {new Date(session.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          )}

          {live && (
            <div className="mb-6">
              <QuestionForm
                sessionId={session.id}
                onQuestionPosted={async () => {
                  "use server";
                  await revalidatePage(`/sessions/${session.id}`);
                }}
              />
            </div>
          )}

          <QuestionList
            questions={session.questions.map((q) => ({
              id: q.id,
              content: q.content,
              authorName: q.authorName,
              upvotes: q.upvotes,
              createdAt: q.createdAt.toISOString(),
            }))}
            sessionId={session.id}
          />
        </div>
      </main>
    </div>
  );
}