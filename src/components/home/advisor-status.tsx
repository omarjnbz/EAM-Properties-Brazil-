import { Check } from "@phosphor-icons/react/dist/ssr/Check";
import { SITE } from "@/content/site";
import { getDictionary } from "@/i18n/server";
import { Button } from "@/components/ui/primitives";
import { Rich } from "@/components/ui/rich";
import { LiveClock } from "@/components/ui/live-clock";
import { LiveDot } from "@/components/ui/live-dot";

const OFFICES = [
  { key: "dubai", tz: "Asia/Dubai" },
  { key: "saoPaulo", tz: "America/Sao_Paulo" },
] as const;

/** "Advisor online" card: live office clocks, the trust promises and a direct WhatsApp line. */
export async function AdvisorStatus() {
  const { home } = await getDictionary();
  const a = home.advisor;
  return (
    <div className="rounded-[24px] bg-white p-5 shadow-[0_1px_2px_rgba(11,27,47,0.05),0_24px_60px_-40px_rgba(11,27,47,0.35)] ring-1 ring-ink/[0.05] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-[14px] font-medium text-ink">
          <LiveDot className="size-2" /> {a.online}
        </span>
        <span className="text-[12.5px] text-ink-3">{a.replies}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {OFFICES.map((c) => (
          <div key={c.key} className="rounded-2xl bg-paper-2 px-3.5 py-3">
            <div className="text-[12px] text-ink-3">{a[c.key]}</div>
            <LiveClock timeZone={c.tz} className="mt-0.5 block text-[1.6rem] font-medium tracking-[-0.03em] text-ink" />
          </div>
        ))}
      </div>
      <ul className="mt-4 flex flex-col gap-2 text-[13.5px] text-ink-2">
        {home.hero.trust.map((t) => (
          <li key={t} className="flex items-center gap-2">
            <span className="grid size-4 place-items-center rounded-full bg-leaf-soft text-leaf-deep">
              <Check weight="bold" className="size-2.5" aria-hidden />
            </span>
            <Rich text={t} />
          </li>
        ))}
      </ul>
      <Button href={SITE.whatsappHref} variant="ink" icon="whatsapp" className="mt-5 w-full justify-center">
        {home.hero.secondary}
      </Button>
    </div>
  );
}
