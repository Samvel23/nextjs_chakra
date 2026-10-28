import "server-only";

import { cookies } from "next/headers";

import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "tech-events-session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

const getAuthSecret = (): string => {
  const secret = process.env.AUTH_SECRET;

  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") {
    return "development-only-session-secret-change-before-deploy";
  }

  throw new Error("AUTH_SECRET must be configured in production.");
};

const signatureFor = (expiresAt: string) =>
  createHmac("sha256", getAuthSecret()).update(expiresAt).digest("hex");

export const createSessionToken = (): string => {
  const expiresAt = String(
    Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  );

  return `${expiresAt}.${signatureFor(expiresAt)}`;
};

export const isValidSessionToken = (token: string | undefined): boolean => {
  if (!token) return false;

  const [expiresAt, signature, ...extraParts] = token.split(".");

  if (
    extraParts.length > 0 ||
    !expiresAt ||
    !signature ||
    !/^\d+$/.test(expiresAt) ||
    !/^[a-f0-9]{64}$/.test(signature)
  ) {
    return false;
  }

  if (Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false;

  const expected = Buffer.from(signatureFor(expiresAt), "hex");
  const actual = Buffer.from(signature, "hex");

  return actual.length === expected.length && timingSafeEqual(actual, expected);
};

export const hasDashboardSession = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  return isValidSessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
};

export const requireDashboardSession = async (): Promise<void> => {
  if (!(await hasDashboardSession())) {
    throw new Error("Unauthorized dashboard access.");
  }
};
