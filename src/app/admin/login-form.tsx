"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, null);
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <form action={action} className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-[0_1px_2px_rgba(11,27,47,0.05),0_24px_60px_-40px_rgba(11,27,47,0.35)] ring-1 ring-ink/[0.06] sm:p-8">
        <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-navy">EAM Global</p>
        <h1 className="mt-1 text-[1.6rem] font-medium tracking-[-0.02em]">Admin</h1>
        <p className="mt-1 text-[14px] text-ink-3">AI usage, leads and Daniel, in one place.</p>
        {configured ? (
          <>
            <label htmlFor="password" className="mt-6 block text-[13px] font-medium text-ink-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              className="mt-1.5 h-12 w-full rounded-2xl bg-paper px-4 text-[16px] outline-none ring-1 ring-transparent focus:ring-navy/40"
            />
            <button
              type="submit"
              disabled={pending}
              className="mt-4 h-12 w-full rounded-full bg-ink text-[15px] font-medium text-white transition-[background-color,scale] duration-150 ease-expo hover:bg-ink-2 active:scale-[0.98] disabled:opacity-60"
            >
              {pending ? "Checking…" : "Open the admin"}
            </button>
            <p aria-live="polite" className="mt-3 min-h-5 text-[13.5px] text-[#8d3b1c]">
              {state?.error}
            </p>
          </>
        ) : (
          <p className="mt-6 rounded-2xl bg-sun-soft px-4 py-3 text-[14px] text-ink">
            Locked: set <code className="font-mono text-[13px]">ADMIN_PASSWORD</code> (at least 10 characters) on the server, then reload.
          </p>
        )}
      </form>
    </main>
  );
}
