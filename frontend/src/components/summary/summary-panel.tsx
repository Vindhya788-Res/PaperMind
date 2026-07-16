import { Badge } from "@/components/ui/badge";
import type { PaperSummary } from "@/types";

interface SummaryPanelProps {
  summary: PaperSummary;
}

export function SummaryPanel({ summary }: SummaryPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Badge variant="accent">AI summary</Badge>
        <span className="text-xs text-muted-foreground">Placeholder — backend not connected</span>
      </div>

      <Section title="Executive summary">
        <p className="text-sm leading-relaxed text-foreground">{summary.executive}</p>
      </Section>

      <Section title="Key points">
        <BulletList items={summary.bullets} />
      </Section>

      <Section title="Key contributions">
        <BulletList items={summary.contributions} />
      </Section>

      <Section title="Methodology">
        <p className="text-sm leading-relaxed text-muted-foreground">{summary.methodology}</p>
      </Section>

      <Section title="Limitations">
        <p className="text-sm leading-relaxed text-muted-foreground">{summary.limitations}</p>
      </Section>

      <Section title="Future work">
        <p className="text-sm leading-relaxed text-muted-foreground">{summary.futureWork}</p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-snug text-foreground">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}
