# BookNook – A Small Online Library

BookNook is a web-based library application where readers can discover books, borrow available copies, and manage their own book collections and active borrows. Users can also add and manage books in the shared library.

## Features

- **Browse the library:** Explore the book catalog, view book details, and check copy availability.
- **Latest arrivals:** Discover the six most recently added books on the home page.
- **Authentication:** Create an account and sign in with email and password or Google using Better Auth.
- **Add books:** Authenticated users can add books with details, descriptions, copy counts, and cover images.
- **Manage your books:** View, edit, and delete the books you have added.
- **Borrow and return books:** Borrow available copies and manage active borrow records from the My Borrows page.
- **Availability management:** Book availability is updated when books are borrowed and returned.
- **Protected pages:** Pages for adding books, managing your books, and viewing your borrows require authentication.
- **Responsive interface:** The layout adapts to desktop, tablet, and mobile screen sizes.
- **Helpful feedback:** Loading states, error messages, and toast notifications help communicate application status.
- **Custom not-found page:** Unavailable routes display a BookNook 404 page.

## Technology Stack

### Client

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [shadcn/ui](https://ui.shadcn.com/) components
- [Better Auth](https://www.better-auth.com/) with the MongoDB adapter and JWT plugin
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [Swiper](https://swiperjs.com/) for the home page slider
- [Lucide React](https://lucide.dev/) for icons
- [Sonner](https://sonner.emilkowal.ski/) for toast notifications

### Backend

The client communicates with the separate BookNook Express API:

- [Express](https://expressjs.com/)
- MongoDB
- JWT verification with [jose](https://github.com/panva/jose)


## Getting Started

### Prerequisites

Make sure you have the following installed or available:

- [Node.js](https://nodejs.org/) (use a current LTS version)
- npm
- A MongoDB database
- The [BookNook Server](https://github.com/saikot-shahriyar/booknook-server) API
- An ImgBB API key for book-cover uploads
- Google OAuth credentials if you want to enable Google sign-in

### 1. Clone the repository

```bash
git clone https://github.com/saikot-shahriyar/booknook-client.git
cd booknook-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file by copying the example:

**Windows PowerShell**

```powershell
Copy-Item .env.example .env.local
```

**macOS / Linux**

```bash
cp .env.example .env.local
```

Open `.env.local` and provide the values from the table below. Do not commit this file.

### Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the BookNook Express backend API. The server listens on `PORT=5000` in the [BookNook Server repository](https://github.com/saikot-shahriyar/booknook-server). |
| `NEXT_PUBLIC_APP_URL` | Base URL of this client app (`http://localhost:3000` locally) — the default base URL for the Better Auth client. |
| `BETTER_AUTH_URL` | Better Auth base URL where the auth API is served (`http://localhost:3000` locally). |
| `BETTER_AUTH_SECRET` | Secret used by Better Auth to sign sessions. Must be at least 32 characters — generate one with `openssl rand -hex 32`. |
| `MONGODB_URI` | MongoDB connection URI for the application database; the database name is `booknook`. |
| `GOOGLE_CLIENT_ID` | Optional: Google OAuth client ID — enables sign-in with Google in `src/lib/auth.ts`. |
| `GOOGLE_CLIENT_SECRET` | Optional: Google OAuth client secret. |
| `IMGBB_API_KEY` | ImgBB API key used by the server-side upload proxy in `src/app/api/upload/route.ts` so the key is never exposed to the browser. |

### 4. Start the backend

Follow the setup instructions in the [BookNook Server repository](https://github.com/saikot-shahriyar/booknook-server) and make sure the API is running at the URL configured in `NEXT_PUBLIC_API_URL`.

### 5. Run the client

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Live Site: 