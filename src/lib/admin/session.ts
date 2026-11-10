/**
 * The admin panel's one password (ADMIN_PASSWORD) and its session cookie.
 *
 * Server-only (node:crypto). The cookie holds an expiry and an HMAC of it keyed
 * with the password, so it can't be forged, and changing ADMIN_PASSWORD logs
 * everyone out. No database, no user accounts: one shared team password.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

export const ADMIN_COOKIE = "eam_admin";
export const SESSION_DAYS = 7;

const password = () => process.env.ADMIN_PASSWORD ?? "";

/** The panel stays locked until a password of at least 10 characters is set. */
export const adminConfigured = () => password().length >= 10;

const sign = (expires: number) => createHmac("sha256", password()).update(`eam-admin:${expires}`).digest("base64url");

export function newSessionToken() {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return `${expires}.${sign(expires)}`;
}

function same(a: string, b: string) {
  // Compare fixed-length digests, so neither length nor content leaks through timing.
  const x = createHmac("sha256", "compare").update(a).digest();
  const y = createHmac("sha256", "compare").update(b).digest();
  return timingSafeEqual(x, y);
}

export function passwordMatches(input: string) {
  return adminConfigured() && same(input, password());
}

function validToken(token: string | undefined) {
  if (!token || !adminConfigured()) return false;
  const [stamp, signature] = token.split(".");
  const expires = Number(stamp);
  if (!expires || !signature || expires < Date.now()) return false;
  return same(signature, sign(expires));
}

/** True when this request carries a valid admin session. Reads cookies, so call it inside <Suspense>. */
export async function isAdmin() {
  // Checking the expiry reads the clock, which is only allowed at request time (cacheComponents).
  await connection();
  return validToken((await cookies()).get(ADMIN_COOKIE)?.value);
}
