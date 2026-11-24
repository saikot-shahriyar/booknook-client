
import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { db, client } from "@/lib/mongodb";

const hasGoogleAuth = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

const authBaseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

export const auth = betterAuth({
  appName: "BookNook",

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  // Server-side password validation
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") {
        return;
      }

      const password = ctx.body?.password;

      if (typeof password !== "string") {
        throw new APIError("BAD_REQUEST", {
          message: "Password is required.",
        });
      }

      if (password.length < 6) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must be at least 6 characters long.",
        });
      }

      if (!/[A-Z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must include at least one uppercase letter (A-Z).",
        });
      }

      if (!/[a-z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must include at least one lowercase letter (a-z).",
        });
      }
    }),
  },

  ...(hasGoogleAuth
    ? {
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      },
    }
    : {}),

  plugins: [
    jwt({
      jwt: {
        issuer: authBaseUrl,
        audience: authBaseUrl,
      },
    }),
  ],

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: authBaseUrl,
});

export type Auth = typeof auth;
