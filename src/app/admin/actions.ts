"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, SESSION_DAYS, adminConfigured, newSessionToken, passwordMatches } from "@/lib/admin/session";

export type LoginState = { error?: string } | null;

// Best-effort brute-force brake, per server instance: 8 tries per 15 minutes per address.
const attempts = new Map<string, number[]>();
const WINDOW = 15 * 60 * 1000;
const MAX_TRIES = 8;

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  if (!adminConfigured()) return { error: "The admin password isn't set on the server yet (ADMIN_PASSWORD, at least 10 characters)." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (recent.length >= MAX_TRIES) return { error: "Too many tries. Wait 15 minutes and try again." };

  if (!passwordMatches(String(form.get("password") ?? ""))) {
    recent.push(now);
    attempts.set(ip, recent);
    if (attempts.size > 5000) attempts.clear();
    await new Promise((r) => setTimeout(r, 500));
    return { error: "Wrong password." };
  }

  attempts.delete(ip);
  (await cookies()).set(ADMIN_COOKIE, newSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin");
}
