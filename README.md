# EventHub

Plateforme de gestion d'événements (Next.js 15 App Router, Prisma, NextAuth, Tailwind v4, DaisyUI, lucide-react).

## Démarrage

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Ouvrir http://localhost:3000

## Structure

- `app/` — App Router (pages + API routes)
- `prisma/schema.prisma` — modèles User, Event, Reservation, Category
- `components/` — UI réutilisable (Navbar, EventCard, SearchPanel, Filters, Footer)
- `lib/` — clients (prisma, auth)
