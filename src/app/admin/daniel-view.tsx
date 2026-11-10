import { CARDS_GUIDE, SYSTEM_PROMPT } from "@/lib/chat/knowledge";
import { chatProviders } from "@/lib/chat/providers";
import { cn } from "@/lib/cn";
import { Card, PageIntro, whole } from "./ui";

/** Who answers (OpenAI only), which keys are set, and Daniel's full instructions. */
export function DanielView() {
  const ai = chatProviders()[0];
  const hook = process.env.LEADS_WEBHOOK_URL;
  const checks: [string, boolean, string][] = [
    ["OpenAI key", !!process.env.OPENAI_API_KEY, "answers the chat"],
    [
      "Leads webhook",
      !!hook && !!process.env.LEADS_WEBHOOK_SECRET,
      !hook ? "not set: in production, leads are refused and visitors go to WhatsApp" : !process.env.LEADS_WEBHOOK_SECRET ? "set, but LEADS_WEBHOOK_SECRET is missing" : "leads reach the Sheet and the team's email",
    ],
    ["OpenAI admin key", !!process.env.OPENAI_ADMIN_KEY, "AI costs in this admin"],
    ["Search engines", process.env.SITE_INDEXABLE === "true", "SITE_INDEXABLE: off until launch"],
  ];
  // What the chat sends with every question: the instructions plus the card guide.
  const prompt = `${SYSTEM_PROMPT}\n\n${CARDS_GUIDE}`;
  const tokens = whole.format(Math.round(prompt.length / 4));
  return (
    <>
      <PageIntro eyebrow="Daniel" title="Daniel, the AI guide">
        Who answers, which keys this server has (never their values), and the full instructions Daniel receives with every question, built from the
        site&apos;s own content files.
      </PageIntro>
      <Card delay={80}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-[14px] font-medium">Who answers</h3>
            <p className="mt-2 text-[13.5px] text-ink-2">
              {ai ? (
                <>
                  <span className="font-medium text-ink">OpenAI</span> · {String(ai.options.model ?? "")} · reasoning {String(ai.options.reasoning_effort ?? "")}
                </>
              ) : (
                "No OpenAI key: the chat is hidden."
              )}
            </p>
            <h3 className="mt-5 text-[14px] font-medium">Set up on this server</h3>
            <ul className="mt-2 flex flex-col gap-1.5">
              {checks.map(([label, on, what]) => (
                <li key={label} className="flex items-baseline gap-2 text-[13.5px]">
                  <span className={cn("w-11 shrink-0 rounded-full px-2 py-0.5 text-center text-[11px] font-semibold", on ? "bg-leaf-soft text-leaf-deep" : "bg-paper-2 text-ink-3")}>{on ? "ON" : "OFF"}</span>
                  <span className="font-medium text-ink">{label}</span>
                  <span className="text-ink-3">{what}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[14px] font-medium">His instructions</h3>
            <p className="mt-2 text-[13.5px] text-ink-2">
              About {tokens} tokens sent with every question, most of it reused at the cached rate, plus the last 10 messages of the conversation and the
              page the visitor is on.
            </p>
            <p className="mt-2 text-[13px] text-ink-3">
              To change what he knows, edit the site&apos;s content files (src/content/programs.ts, pages.ts, site.ts): the pages and Daniel update together.
              His rules live in src/lib/chat/knowledge.ts.
            </p>
            <details className="mt-3">
              <summary className="cursor-pointer text-[13px] font-medium text-navy">Read the full instructions, ≈ {tokens} tokens</summary>
              <pre className="mt-2 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-xl bg-paper px-3 py-2 font-mono text-[12px] leading-relaxed text-ink-2">{prompt}</pre>
            </details>
          </div>
        </div>
      </Card>
    </>
  );
}
