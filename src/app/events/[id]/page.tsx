import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isLive } from "@/lib/isLive";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { RegisterButton } from "@/components/RegisterButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getSessionStatus(startTime: Date, endTime: Date): { label: string; color: string } {
  const now = new Date();
  if (now >= startTime && now <= endTime) {
    return { label: "LIVE", color: "bg-red-500 text-white" };
  } else if (now < startTime) {
    return { label: "À venir", color: "bg-blue-500 text-white" };
  } else {
    return { label: "Terminée", color: "bg-gray-400 text-white" };
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      sessions: {
        include: {
          room: true,
          speakers: {
            include: {
              speaker: true,
            },
          },
        },
        orderBy: { startTime: "asc" },
      },
    },
  });

  if (!event) notFound();

  const sessionsByTime = new Map();
  for (const session of event.sessions) {
    const timeKey = session.startTime.toISOString();
    if (!sessionsByTime.has(timeKey)) sessionsByTime.set(timeKey, []);
    sessionsByTime.get(timeKey).push(session);
  }
  const sortedTimeSlots = Array.from(sessionsByTime.keys()).sort();
  const allRooms = Array.from(new Map(event.sessions.map(s => [s.roomId, s.room])).values());

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{event.title}</h1>
          <p className="text-gray-600 mb-4">{event.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(event.dateStart).toLocaleDateString("fr-FR")} -{" "}
              {new Date(event.dateEnd).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <div className="mt-4">
            <RegisterButton eventId={event.id} />
          </div>
        </div>

        {/* Planning multi-track */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-900 p-6 pb-0">Planning</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-gray-500 min-w-[100px]">Horaire</th>
                  {allRooms.map((room) => (
                    <th key={room.id} className="text-left p-4 font-medium text-gray-500">
                      {room.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedTimeSlots.map((timeKey) => {
                  const sessions = sessionsByTime.get(timeKey);
                  const timeStr = new Date(timeKey).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <tr key={timeKey} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-700 align-top">{timeStr}</td>
                      {allRooms.map((room) => {
                        const session = sessions.find((s: any) => s.roomId === room.id);
                        const live = session ? isLive(session.startTime, session.endTime) : false;
                        const status = session ? getSessionStatus(session.startTime, session.endTime) : null;
                        return (
                          <td key={room.id} className="p-4 align-top">
                            {session ? (
                              <Link href={`/sessions/${session.id}`}>
                                <div className="group cursor-pointer">
                                  <div className="flex flex-col gap-1 mb-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h3 className="font-medium text-gray-900 group-hover:text-brand-600 transition">
                                        {session.title}
                                      </h3>
                                      {status && (
                                        <span className={`${status.color} text-[10px] px-2 py-0.5 rounded-full ${status.label === "LIVE" ? "animate-pulse" : ""}`}>
                                          {status.label}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                                    {session.description}
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {session.speakers.map(({ speaker }: any) => (
                                      <span
                                        key={speaker.id}
                                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                                      >
                                        {speaker.fullName.split(" ")[0]}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </Link>
                            ) : (
                              <div className="text-gray-300 text-sm">—</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}