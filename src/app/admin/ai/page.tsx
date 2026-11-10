import type { Metadata } from "next";
import { AdminGate } from "../gate";
import { AiView } from "../ai-view";
import { Shell } from "../ui";

export const metadata: Metadata = { title: "AI costs · Admin · EAM Global" };

export default function AiCostsPage() {
  return (
    <AdminGate next="/admin/ai">
      <Shell active="ai">
        <AiView />
      </Shell>
    </AdminGate>
  );
}
