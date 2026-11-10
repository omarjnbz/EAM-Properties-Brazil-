import { Suspense } from "react";
import { adminConfigured, isAdmin } from "@/lib/admin/session";
import { LoginForm } from "./login-form";

/**
 * Every admin page sits behind this: the password form until the visitor has
 * a valid session, then the page. The session check reads a cookie, so it
 * streams in behind <Suspense> (cacheComponents); nothing private is prerendered.
 */
export function AdminGate({ next, children }: { next: string; children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="p-8 text-[14px] text-ink-3">Loading…</p>}>
      <Check next={next}>{children}</Check>
    </Suspense>
  );
}

async function Check({ next, children }: { next: string; children: React.ReactNode }) {
  if (!(await isAdmin())) return <LoginForm configured={adminConfigured()} next={next} />;
  return <>{children}</>;
}
