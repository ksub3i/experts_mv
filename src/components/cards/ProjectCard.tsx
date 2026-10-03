import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import type { Project } from "@/lib/types";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export function ProjectCard({
  project,
  showSummary = false,
  ratio = "4/3",
}: {
  project: Project;
  showSummary?: boolean;
  ratio?: string;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="overflow-hidden">
        <PlaceholderImage
          media={project.cover}
          ratio={ratio}
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex items-end justify-between gap-4 p-6 md:p-8">
        <div>
          <p className="eyebrow text-muted">{project.location}</p>
          <h3 className="display mt-2 text-2xl text-ink">
            {project.title} {project.titleAccent}
          </h3>
          {showSummary && <p className="mt-3 text-sm leading-relaxed text-muted">{project.summary}</p>}
        </div>
        <ArrowUpRightIcon
          size={22}
          className="shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
