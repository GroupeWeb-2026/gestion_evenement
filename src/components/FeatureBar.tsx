import { Calendar, Clock, MessageCircle, Star } from "lucide-react";

const items = [
  { icon: Calendar, title: "Planning multi-track", text: "Visualisez toutes les sessions en simultané" },
  { icon: Clock, title: "Sessions en direct", text: "Repérez facilement ce qui se passe maintenant" },
  { icon: MessageCircle, title: "Questions en direct", text: "Interagissez avec les intervenants" },
  { icon: Star, title: "Sessions favorites", text: "Sauvegardez vos sessions préférées" },
];

export function FeatureBar() {
  return (
    <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8 cursor-default">
      <div className="grid grid-cols-1 gap-4 rounded-2xl bg-brand-100 p-6 sm:grid-cols-2 lg:grid-cols-4">
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