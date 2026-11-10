import type { Metadata } from "next";
import { AdminGate } from "../gate";
import { DanielView } from "../daniel-view";
import { Shell } from "../ui";

export const metadata: Metadata = { title: "Daniel · Admin · EAM Global" };

export default function DanielPage() {
  return (
    <AdminGate next="/admin/daniel">
      <Shell active="daniel">
        <DanielView />
      </Shell>
    </AdminGate>
  );
}
