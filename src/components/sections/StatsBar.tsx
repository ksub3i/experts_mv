import type { Stat } from "@/lib/types";
import { StatCounter } from "@/components/ui/StatCounter";

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <section aria-label="Company at a glance" className="on-accent bg-accent text-on-accent">
      <ul className="container-site grid gap-10 py-14 sm:auto-cols-fr sm:grid-flow-col sm:gap-6">
        {stats.map((stat) => (
          <li key={stat.label} className="text-center">
            <StatCounter stat={stat} labelClassName="opacity-85" />
          </li>
        ))}
      </ul>
    </section>
  );
}
