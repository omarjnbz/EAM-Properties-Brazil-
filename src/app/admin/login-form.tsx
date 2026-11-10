"use client";

import { useActionState } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { LockSimple } from "@phosphor-icons/react/dist/csr/LockSimple";
import { login, type LoginState } from "./actions";

export function LoginForm({ configured, next }: { configured: boolean; next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, null);
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-4">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(127,180,234,0.22),transparent)]" />
      <div className="admin-rise relative w-full max-w-[400px] rounded-[30px] bg-ink/[0.025] p-1.5 ring-1 ring-ink/[0.04]">
        <form action={action} className="rounded-[24px] bg-white p-6 shadow-[0_1px_2px_rgba(11,27,47,0.04),0_30px_70px_-40px_rgba(11,27,47,0.35)] sm:p-8">
          <input type="hidden" name="next" value={next} />
          <span className="grid size-11 place-items-center rounded-full bg-paper text-ink-2">
            <LockSimple weight="light" className="size-5" aria-hidden />
          </span>
          <h1 className="mt-5 text-[1.75rem] font-medium leading-tight tracking-[-0.03em]">EAM Global admin</h1>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-3">Your leads, what the AI costs, and how Daniel is set up. Team only.</p>
          {configured ? (
            <>
              <label htmlFor="password" className="mt-7 block text-[13px] font-medium text-ink-2">
                Team password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                className="mt-1.5 h-12 w-full rounded-2xl bg-paper px-4 text-[16px] outline-none ring-1 ring-transparent transition-shadow focus:ring-navy/40"
              />
              <button
                type="submit"
                disabled={pending}
                className="group mt-4 flex h-12 w-full items-center justify-between rounded-full bg-ink ps-5 pe-1.5 text-[15px] font-medium text-white transition-[background-color,scale] duration-200 ease-expo hover:bg-ink-2 active:scale-[0.98] disabled:opacity-60"
              >
                {pending ? "Checking…" : "Open"}
                <span className="grid size-9 place-items-center rounded-full bg-white/10 transition-transform duration-300 ease-expo group-hover:translate-x-0.5">
                  <ArrowRight weight="light" className="size-4" aria-hidden />
                </span>
              </button>
              <p aria-live="polite" className="mt-3 min-h-5 text-[13.5px] text-[#8d3b1c]">
                {state?.error}
              </p>
            </>
          ) : (
            <p className="mt-7 rounded-2xl bg-sun-soft px-4 py-3 text-[14px] leading-relaxed text-ink">
              Locked for now. The person who runs the website needs to set the team password on the server (ADMIN_PASSWORD, at least 10 characters).
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
