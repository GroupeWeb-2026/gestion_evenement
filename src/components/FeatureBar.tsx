import { BellRing, Headphones, ShieldCheck, Ticket } from "lucide-react";

const items = [
  { icon: Ticket, title: "Réservation simple", text: "Réservez votre place en quelques clics." },
  { icon: ShieldCheck, title: "Paiement sécurisé", text: "Vos paiements sont 100% sécurisés." },
  { icon: BellRing, title: "Rappels & notifications", text: "Recevez des rappels pour ne rien manquer." },
  { icon: Headphones, title: "Support 24/7", text: "Notre équipe est là pour vous aider." },
];

export function FeatureBar() {
  return (
    <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 rounded-2xl bg-brand-50/70 p-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              <p className="text-xs text-gray-600">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
