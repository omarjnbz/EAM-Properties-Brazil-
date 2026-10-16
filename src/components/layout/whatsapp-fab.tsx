import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr/WhatsappLogo";
import { SITE } from "@/content/site";

/** Mobile-only floating WhatsApp button with the 60-minute promise. */
export function WhatsappFab() {
  return (
    <a
      href={SITE.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 end-4 z-30 inline-flex items-center gap-2 rounded-full bg-ink py-1.5 ps-1.5 pe-4 text-[13px] font-medium text-paper shadow-[0_18px_40px_-14px_rgba(11,27,47,0.6)] ring-1 ring-white/10 transition-transform duration-500 ease-fluid active:scale-[0.97] md:hidden"
    >
      <span className="grid size-9 place-items-center rounded-full bg-leaf">
        <WhatsappLogo weight="fill" className="size-[18px] text-white" aria-hidden />
      </span>
      Reply in 60 min
    </a>
  );
}
