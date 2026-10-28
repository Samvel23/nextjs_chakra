"use server";

import { timingSafeEqual } from "node:crypto";

import { createSessionToken, SESSION_COOKIE_NAME } from "@/entities/session";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loginErrorValues = ["invalidPassword", "notConfigured"] as const;
type TLoginError = (typeof loginErrorValues)[number] | null;

export type TLoginState = {
  error: TLoginError;
};

export const loginAction = async (
  _previousState: TLoginState,
  formData: FormData,
): Promise<TLoginState> => {
  const expectedPassword =
    process.env.DASHBOARD_PASSWORD ??
    (process.env.NODE_ENV === "production" ? undefined : "demo-password");
  const submittedPassword = formData.get("password");

  if (!expectedPassword) return { error: "notConfigured" };

  if (typeof submittedPassword !== "string") {
    return { error: "invalidPassword" };
  }

  const expectedBytes = Buffer.from(expectedPassword);
  const submittedBytes = Buffer.from(submittedPassword);
  const isValid =
    expectedBytes.length === submittedBytes.length &&
    timingSafeEqual(expectedBytes, submittedBytes);

  if (!isValid) return { error: "invalidPassword" };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect("/dashboard");
};

export const logoutAction = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
};
