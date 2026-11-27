import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ensureMongoConnected } from "@/lib/mongodb";

/**
 * Retrieves the current authenticated user session on the server side
 * using incoming request headers from Next.js App Router.
 */
export async function getServerSession() {
  const reqHeaders = await headers();
  await ensureMongoConnected();
  return await auth.api.getSession({
    headers: reqHeaders,
  });
}

/**
 * Server-side route guard.
 * Validates the session on the server. If no active session exists,
 * immediately performs a server-side redirect to /login with callbackUrl.
 */
export async function requireAuth(callbackUrl: string) {
  const session = await getServerSession();
  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  return session;
}