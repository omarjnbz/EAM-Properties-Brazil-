import { InstagramLogo } from "@phosphor-icons/react/dist/ssr/InstagramLogo";
import { TiktokLogo } from "@phosphor-icons/react/dist/ssr/TiktokLogo";
import { YoutubeLogo } from "@phosphor-icons/react/dist/ssr/YoutubeLogo";
import { SOCIAL } from "@/content/site";
import { cn } from "@/lib/cn";

const ICONS = { youtube: YoutubeLogo, instagram: InstagramLogo, tiktok: TiktokLogo } as const;

/**
 * YouTube, Instagram and TikTok. Accounts without a URL yet show as
 * "coming soon" instead of a dead link.
 */
export function SocialLinks({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Social channels">
      {SOCIAL.map((s) => {
        const Icon = ICONS[s.key];
        const chip = cn(
          "inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13.5px] font-medium transition-colors duration-300",
          dark ? "bg-white/[0.06] text-white ring-1 ring-white/10" : "bg-white text-ink ring-1 ring-ink/[0.07]",
        );
        return (
          <li key={s.key}>
            {s.url ? (
              <a href={s.url} target="_blank" rel="noopener noreferrer" className={cn(chip, dark ? "hover:bg-white/[0.12]" : "hover:ring-ink/20")}>
                <Icon weight="fill" className="size-[18px]" aria-hidden />
                {s.label}
              </a>
            ) : (
              <span className={cn(chip, "cursor-default")} aria-label={`${s.label}: coming soon`}>
                <Icon weight="fill" className={cn("size-[18px]", dark ? "text-white/50" : "text-ink-3")} aria-hidden />
                <span className={dark ? "text-white/70" : "text-ink-2"}>{s.label}</span>
                <span className={cn("rounded-full px-1.5 py-0.5 text-[10.5px] font-medium", dark ? "bg-white/10 text-white/60" : "bg-canvas text-ink-3")}>Soon</span>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
