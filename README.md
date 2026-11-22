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

## Project Structure

```text
booknook-client/
├── public/                  # Static assets
├── src/
│   ├── app/
│   │   ├── add-book/        # Add a book (protected)
│   │   ├── api/
│   │   │   ├── auth/        # Better Auth API handler
│   │   │   └── upload/      # Server-side ImgBB upload endpoint
│   │   ├── books/
│   │   │   └── [id]/        # Book details page
│   │   ├── login/           # Login page
│   │   ├── my-books/        # Manage books added by the user
│   │   ├── my-borrows/      # View and return borrowed books
│   │   ├── register/        # Registration page
│   │   ├── layout.tsx       # Root layout
│   │   ├── not-found.tsx    # Custom 404 page
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   ├── auth/            # Authentication and route protection
│   │   ├── books/           # Book, borrow, and management components
│   │   ├── home/            # Home page sections
│   │   ├── icons/           # Custom icons
│   │   ├── layout/          # Navbar and footer
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # API, authentication, database, and utilities
│   └── types/               # Shared TypeScript types
├── .env.example             # Environment variable template
├── components.json          # UI component configuration
├── next.config.ts
├── package.json
└── tsconfig.json
```

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

Open `.env.local` and provide the values described below. Do not commit this file.

### 4. Start the backend

Follow the setup instructions in the [BookNook Server repository](https://github.com/saikot-shahriyar/booknook-server) and make sure the API is running at the URL configured in `NEXT_PUBLIC_API_URL`.

### 5. Run the client

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

The client repository includes these variables in `.env.example` or reads them in its configuration.

| Variable | Visibility | Required | Description |
|---|---|---:|---|
| `NEXT_PUBLIC_API_URL` | Public | Yes for a non-default API URL | Base URL of the Express backend. Defaults to `http://localhost:5000`. |
| `NEXT_PUBLIC_APP_URL` | Public | Optional for local development | Base URL used by the Better Auth client. Defaults to `http://localhost:3000`. Set it when the client runs on a different URL. |
| `MONGODB_URI` | Server-only | Yes | MongoDB connection URI used by the Better Auth database adapter. |
| `BETTER_AUTH_SECRET` | Server-only | Yes | Secret used by Better Auth. Use a strong secret of at least 32 characters. |
| `BETTER_AUTH_URL` | Server-only | Recommended | Base URL for the Better Auth server and JWT issuer/audience. Defaults to `http://localhost:3000`. |
| `GOOGLE_CLIENT_ID` | Server-only | Optional | Google OAuth client ID. Configure it together with the client secret to enable Google sign-in. |
| `GOOGLE_CLIENT_SECRET` | Server-only | Optional | Google OAuth client secret. Never expose it in browser code. |
| `IMGBB_API_KEY` | Server-only | Required for image uploads | ImgBB API key used by the server-side upload route. It is never sent to the browser. |

**Important security notes:**

- Only variables prefixed with `NEXT_PUBLIC_` are exposed to browser-side code. Never put secrets in a `NEXT_PUBLIC_` variable.
- Keep `.env.local` out of Git.
- Never publish MongoDB credentials, Better Auth secrets, Google OAuth secrets, or the ImgBB API key.
- Google sign-in is enabled only when both Google OAuth credentials are configured.

## Available Scripts

Run these commands from the client project directory:

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Start the production server (run `npm run build` first). |
| `npm run lint` | Run ESLint. |

## Related Repository

- **Backend:** [booknook-server](https://github.com/saikot-shahriyar/booknook-server)

---

Built with Next.js, React, and MongoDB.
