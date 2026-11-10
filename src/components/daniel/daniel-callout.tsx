import { getDictionary } from "@/i18n/server";
import { chatEnabled } from "@/lib/chat/providers";
import { Reveal } from "@/components/ui/reveal";
import { AskDaniel } from "./ask-daniel";
import { DanielMark } from "./daniel-mark";

/** Under a country page's routes table: "Questions about these routes? Ask Daniel about Brazil". */
export async function DanielRoutesCallout({ country }: { country: string }) {
  if (!chatEnabled()) return null;
  const { chat } = await getDictionary();
  return (
    <Reveal className="mt-10">
      <div className="flex flex-col gap-4 rounded-[1.6rem] bg-white p-5 shadow-[0_1px_2px_rgba(11,27,47,0.05)] ring-1 ring-navy/10 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
        <DanielMark size={46} />
        <div className="flex-1">
          <p className="text-[16.5px] font-medium tracking-[-0.01em] text-ink">{chat.ask.routesTitle}</p>
          <p className="mt-0.5 text-[14px] leading-relaxed text-ink-3">{chat.ask.routesBody}</p>
        </div>
        <AskDaniel kind="routes" country={country} variant="solid" className="self-start sm:self-center" />
      </div>
    </Reveal>
  );
}
