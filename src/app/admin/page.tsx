import { Suspense } from "react";
import { adminConfigured, isAdmin } from "@/lib/admin/session";
import { Dashboard } from "./dashboard";
import { LoginForm } from "./login-form";

/**
 * /admin: one password, then everything on one page (AI usage and cost, leads,
 * Daniel's set-up). The session check reads a cookie, so it streams in behind
 * <Suspense> (cacheComponents); nothing private is ever prerendered.
 */
export default function AdminPage() {
  return (
    <Suspense fallback={<p className="p-8 text-[14px] text-ink-3">Loading…</p>}>
      <Gate />
    </Suspense>
  );
}

async function Gate() {
  if (!(await isAdmin())) return <LoginForm configured={adminConfigured()} />;
  return <Dashboard />;
}
