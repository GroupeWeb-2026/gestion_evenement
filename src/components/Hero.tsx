import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SearchPanel } from "./SearchPanel";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 38%, rgba(255,255,255,0.1) 60%), url('https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1600')",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="text-gray-800">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl text-gray-800">
            Découvrez des événements
            <br /> et participez en direct
          </h1>
          <p className="mt-4 max-w-md text-base text-gray-800">
            Conférences, ateliers, concerts. Posez vos questions et interagissez avec les intervenants.
          </p>
          <Link
            href="/events"
            className="btn mt-8 inline-flex items-center gap-2 rounded-full border-0 bg-brand-600 px-6 text-white shadow-lg shadow-brand-600/40 hover:bg-brand-700"
          >
            Explorer les événements <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="lg:justify-self-end lg:self-center w-full max-w-md">
          <SearchPanel />
        </div>
      </div>
    </section>
  );
}