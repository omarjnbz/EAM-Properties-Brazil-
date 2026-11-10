import { AdminGate } from "./gate";
import { LeadsView } from "./leads-view";
import { Shell } from "./ui";

/** /admin opens on the leads: the page the team uses every day. */
export default function LeadsPage() {
  return (
    <AdminGate next="/admin">
      <Shell active="leads">
        <LeadsView />
      </Shell>
    </AdminGate>
  );
}
