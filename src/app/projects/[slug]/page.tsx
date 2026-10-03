import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { getProject, getProjects } from "@/lib/content";
import { PageHero } from "@/components/sections/PageHero";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { cx } from "@/lib/utils";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} ${project.titleAccent} — ${project.category}`,
    description: project.summary,
  };
}

/** Repeating 6-image rhythm: wide, two halves, then three across. */
const tileLayout = ["md:col-span-6", "md:col-span-3", "md:col-span-3", "md:col-span-2", "md:col-span-2", "md:col-span-2"];
const tileRatio = ["16/9", "4/3", "4/3", "1/1", "1/1", "1/1"];

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();

  const i = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(i + 1) % projects.length];

  return (
    <>
      <PageHero
        lines={[{ text: project.title }, { text: project.titleAccent, outline: true }]}
        subtitle={`${project.category} in ${project.location}`}
        media={{ ...project.cover, alt: "" }}
      />

      <section className="py-20 md:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="display text-[clamp(1.75rem,3.5vw,2.75rem)] text-ink">The project</h2>
            <p className="mt-6 max-w-2xl leading-relaxed text-muted">
              {project.summary} Placeholder — expand with the client&apos;s goals, the scope of work, any challenges
              solved along the way, and the finished result.
            </p>
          </div>
          <dl className="grid content-start gap-6 border-t-2 border-accent pt-6">
            {[
              ["Location", project.location],
              ["Project type", project.category],
              ["Timeline", "[X] weeks"],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="eyebrow text-muted">{term}</dt>
                <dd className="mt-1 text-lg font-semibold">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className="container-site mt-16 grid gap-4 md:grid-cols-6">
          {project.gallery.map((media, n) => (
            <li key={n} className={cx(tileLayout[n % tileLayout.length])}>
              <PlaceholderImage
                media={media}
                ratio={tileRatio[n % tileRatio.length]}
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </li>
          ))}
        </ul>

        <nav aria-label="Project navigation" className="container-site mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
          <Link href="/gallery" className="eyebrow inline-flex min-h-12 items-center gap-2 text-ink hover:text-accent">
            <ArrowLeftIcon size={18} aria-hidden="true" /> All projects
          </Link>
          <Link
            href={`/projects/${nextProject.slug}`}
            className="eyebrow inline-flex min-h-12 items-center gap-2 text-ink hover:text-accent"
          >
            Next: {nextProject.title} {nextProject.titleAccent}
            <ArrowRightIcon size={18} aria-hidden="true" />
          </Link>
        </nav>
      </section>
    </>
  );
}
