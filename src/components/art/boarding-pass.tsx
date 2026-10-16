import { AirplaneTilt } from "@phosphor-icons/react/dist/ssr/AirplaneTilt";
import { cn } from "@/lib/cn";

type Props = {
  from?: { code: string; city: string };
  to?: { code: string; city: string };
  className?: string;
  fields?: { label: string; value: string }[];
};

/**
 * Dubai → São Paulo boarding pass: the door-to-door promise as an object.
 * Built in HTML/SVG, so it weighs a few hundred bytes.
 */
export function BoardingPass({
  from = { code: "DXB", city: "Dubai" },
  to = { code: "GRU", city: "São Paulo" },
  className,
  fields = [
    { label: "Passenger", value: "Your family" },
    { label: "Class", value: "Door-to-Door" },
    { label: "Status", value: "Approved" },
  ],
}: Props) {
  return (
    <div
      className={cn(
        "@container relative flex overflow-hidden rounded-[1.4rem] bg-[#fbf9f4] text-ink shadow-[0_40px_70px_-40px_rgba(11,27,47,0.55),0_2px_0_rgba(255,255,255,0.9)_inset] ring-1 ring-ink/[0.07]",
        className,
      )}
      style={{
        mask: "radial-gradient(circle 10px at 74% 0, #0000 97%, #000) top / 100% 51% no-repeat, radial-gradient(circle 10px at 74% 100%, #0000 97%, #000) bottom / 100% 51% no-repeat",
        WebkitMask:
          "radial-gradient(circle 10px at 74% 0, #0000 97%, #000) top / 100% 51% no-repeat, radial-gradient(circle 10px at 74% 100%, #0000 97%, #000) bottom / 100% 51% no-repeat",
      }}
    >
      <div className="flex w-[74%] flex-col gap-4 p-4 @sm:p-6">
        <div className="flex items-center justify-between gap-2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.16em] text-ink-3 @sm:text-[9.5px] @sm:tracking-[0.2em]">
          <span>EAM Global · Boarding pass</span>
          <span className="hidden @md:inline">Seq 001</span>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="font-display text-[2.1rem] leading-none tracking-[-0.02em] @sm:text-[2.6rem]">{from.code}</div>
            <div className="mt-1 text-[12px] text-ink-3">{from.city}</div>
          </div>
          <div className="relative mb-5 flex flex-1 items-center">
            <span className="h-px flex-1 border-t border-dashed border-ink/25" />
            <AirplaneTilt weight="light" className="mx-1.5 size-5 rotate-45 text-navy" aria-hidden />
            <span className="h-px flex-1 border-t border-dashed border-ink/25" />
          </div>
          <div className="text-end">
            <div className="font-display text-[2.1rem] leading-none tracking-[-0.02em] @sm:text-[2.6rem]">{to.code}</div>
            <div className="mt-1 text-[12px] text-ink-3">{to.city}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 border-t border-ink/[0.08] pt-3">
          {fields.map((f) => (
            <div key={f.label} className="min-w-0">
              <div className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-ink-3">{f.label}</div>
              <div className={cn("mt-1 text-[11.5px] font-medium leading-tight @sm:text-[12.5px]", f.label === "Status" && "text-leaf-deep")}>{f.value}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative flex w-[26%] flex-col items-center justify-between border-s border-dashed border-ink/20 bg-paper-2/70 px-3 py-5">
        <div className="text-center font-mono text-[9px] uppercase tracking-[0.18em] text-ink-3">Gate</div>
        <div className="text-center font-display text-xl leading-none">24/7</div>
        <span aria-hidden className="block h-9 w-full bg-[url(/art/barcode.svg)] bg-[length:100%_100%] opacity-85" />
      </div>
    </div>
  );
}
