# EventHub

Plateforme de gestion d'événements (Next.js 15 App Router, Prisma, NextAuth, Tailwind v4, DaisyUI, lucide-react).

## Démarrage

```bash
git clone https://github.com/Henin-ts/gestion_evenement.git
cd gestion_evenement
git checkout Leno
npm install
```
## Créer le fichier .env à la racine(et ajouter cela)
```
DATABASE_URL="postgresql://postgres:leno_27@localhost:5432/gestion_evenement"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="84e214ec4ed4294d657ce0217242e7b8a4e95ef8547ca91f96c99cde344146a3"
ADMIN_EMAIL="admin@eventsync.com"
ADMIN_PASSWORD="admin123"
```
## Créer la base de données(executer cela sur votre terminal vscode)
```bash
npx prisma migrate reset --force
```
## Appliquer les migrations
```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```
## Lancer le serveur
```bash
npm run dev
```
## Acceder à l'application
Ouvrir http://localhost:3000
## Se connecter en tant qu'admin
- Email : 
```bash
admin@eventsync.com
```
- Mot de passe :
```bash
admin123
```

## Structure

- `app/` — App Router (pages + API routes)
- `prisma/schema.prisma` — modèles User, Event, Reservation, Category
- `components/` — UI réutilisable (Navbar, EventCard, SearchPanel, Filters, Footer)
- `lib/` — clients (prisma, auth)

  