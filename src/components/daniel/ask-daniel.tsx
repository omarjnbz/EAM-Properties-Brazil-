import { getDictionary } from "@/i18n/server";
import { chatEnabled } from "@/lib/chat/providers";
import { fill } from "./bus";
import { AskDanielButton } from "./ask-daniel-button";

type Props = { variant?: "chip" | "link" | "solid"; className?: string; label?: string } & (
  | { kind: "residence" | "passport"; country: string }
  | { kind: "faq"; question: string }
  | { kind: "routes"; country: string }
  | { kind: "custom"; question: string }
);

/**
 * "Ask Daniel" entry points for server-rendered pages. Renders nothing while
 * the chat is off (no AI key), exactly like the launcher, so a page never
 * shows a button that leads nowhere.
 */
export async function AskDaniel(props: Props) {
  if (!chatEnabled()) return null;
  const { chat } = await getDictionary();
  const a = chat.ask;
  let question: string;
  let label = props.label ?? a.button;
  switch (props.kind) {
    case "residence":
      question = fill(a.residenceQuestion, { country: props.country });
      break;
    case "passport":
      question = fill(a.passportQuestion, { country: props.country });
      break;
    case "routes":
      question = fill(a.routesQuestion, { country: props.country });
      label = props.label ?? fill(a.about, { topic: props.country });
      break;
    case "faq":
      question = fill(a.faqQuestion, { question: props.question });
      label = props.label ?? a.faq;
      break;
    default:
      question = props.question;
  }
  return <AskDanielButton question={question} label={label} variant={props.variant} className={props.className} />;
}

/** True when Daniel is on, for server components that frame an entry point with more than a button. */
export const danielOn = () => chatEnabled();
