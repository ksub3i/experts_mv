import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import type { Service } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { HashLink } from "@/components/ui/HashLink";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <HashLink
      href={`/services#service-${service.slug}`}
      className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-paper p-8 text-ink shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
    >
      <Icon name={service.icon} size={44} className="text-ink" />
      <h3 className="mt-6 text-lg leading-snug font-bold tracking-wide uppercase">{service.title}</h3>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{service.summary}</p>
      <ArrowUpRightIcon
        size={22}
        className="mt-6 self-end text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    </HashLink>
  );
}
