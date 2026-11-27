import { auth } from "@/lib/auth";
import { ensureMongoConnected } from "@/lib/mongodb";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

async function withMongo(
    run: () => Promise<Response> | Response
): Promise<Response> {
    try {
        await ensureMongoConnected();
    } catch {
        return Response.json(
            { message: "Database is temporarily unavailable. Please try again." },
            { status: 503 }
        );
    }
    return run();
}

export async function GET(request: Request) {
    return withMongo(() => handler.GET(request));
}

export async function POST(request: Request) {
    return withMongo(() => handler.POST(request));
}