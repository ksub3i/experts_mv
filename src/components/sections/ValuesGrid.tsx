import type { CompanyValue } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";

export function ValuesGrid({ values }: { values: CompanyValue[] }) {
  return (
    <section className="on-dark bg-ink py-20 text-paper md:py-28">
      <div className="container-site">
        <p className="eyebrow text-highlight">Three principles shape how we plan, build and grow</p>
        <h2 className="display mt-4 text-[clamp(2.25rem,5.5vw,4rem)]">Our company values</h2>
        <ul className="mt-14 grid md:grid-cols-3">
          {values.map((v, i) => (
            <li
              key={v.title}
              className={
                i === 0
                  ? "py-8 md:py-0 md:pr-10"
                  : "border-t border-line-inverse py-8 md:border-t-0 md:border-l md:px-10 md:py-0"
              }
            >
              <p className="display text-5xl text-brand-red" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-6 flex items-center gap-4 text-lg font-bold tracking-[0.12em] uppercase">
                <Icon name={v.icon} size={36} className="shrink-0 text-highlight" />
                {v.title}
              </h3>
              <p className="mt-5 leading-relaxed text-muted-inverse">{v.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
