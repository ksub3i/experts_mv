import type { Project } from "@/lib/types";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

export function ProjectTeaser({ projects }: { projects: Project[] }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-center">
        <div>
          <p className="eyebrow text-accent">Our work</p>
          <DisplayHeading className="mt-4 text-ink" lines={[{ text: "From the first visit" }, { text: "to the final finish." }]} />
          <p className="mt-6 max-w-md leading-relaxed text-muted">
            Interior or exterior, a small repair or a full renovation — explore some of the homes and spaces
            we&apos;ve transformed, and follow along on social media for projects in progress.
          </p>
          <ButtonLink href="/gallery" className="mt-10">
            View projects
          </ButtonLink>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} ratio="4/5" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
