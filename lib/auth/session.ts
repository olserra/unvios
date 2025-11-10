import { NewUser } from "@/lib/db/schema";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { cache } from "react";

// Initialize secret key once and reuse it
let globalSecret: string | undefined;

function getOrCreateSecret() {
  if (globalSecret) {
    return globalSecret;
  }

  // Get auth secret from environment
  const rawAuthSecret =
    process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "";

  if (process.env.NODE_ENV === "production" && !rawAuthSecret) {
    throw new Error(
      "AUTH_SECRET environment variable is required in production to sign session tokens"
    );
  }

  // Use environment secret or generate for development
  if (rawAuthSecret) {
    globalSecret = rawAuthSecret;
  } else {
    // Generate a secure random secret for development
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    globalSecret = Buffer.from(randomBytes).toString("base64");
    console.warn(
      "Warning: AUTH_SECRET is not set. Using an auto-generated secret for development. Set AUTH_SECRET in your .env to persist sessions across restarts."
    );
  }

  return globalSecret;
}

const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string
) {
  return compare(plainTextPassword, hashedPassword);
}

type SessionData = {
  user: { id: number };
  expires: string;
  exp?: number;
  iat?: number;
};

export async function signToken(payload: SessionData) {
  try {
    const secretKey = getOrCreateSecret();
    return jwt.sign(payload, secretKey, {
      algorithm: "HS256",
      expiresIn: "2h",
    });
  } catch (e) {
    console.error("Error signing token:", e);
    throw e;
  }
}

export async function verifyToken(input: string) {
  if (!input) {
    return null;
  }
  try {
    const secretKey = getOrCreateSecret();

    // Verify and decode the token
    const payload = jwt.verify(input, secretKey, {
      algorithms: ["HS256"],
    });

    // jwt.verify will handle expiration automatically
    return payload as SessionData;
  } catch (error: any) {
    // Invalid token
    console.debug("Token verification failed:", error?.code);
    return null;
  }
}

export const getSession = cache(async () => {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await verifyToken(session);
});

export async function setSession(user: NewUser) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session: SessionData = {
    user: { id: user.id! },
    expires: expiresInOneDay.toISOString(),
  };
  const encryptedSession = await signToken(session);
  (await cookies()).set("session", encryptedSession, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}
