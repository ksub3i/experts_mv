"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { BrandStripes } from "@/components/ui/BrandStripes";

/** Full-width quote CTA shown above the footer on every page except the quote page itself. */
export function CtaBand({ href }: { href: string }) {
  const pathname = usePathname();
  if (pathname.startsWith(href)) return null;

  return (
    <Link
      href={href}
      // Exact brand crimson: the label is large display text, so 4.4:1 passes (≥3:1 for large text).
      className="group on-accent relative block overflow-hidden bg-brand-red text-on-accent transition-colors hover:bg-accent-strong"
    >
      <BrandStripes className="absolute top-1/2 -left-6 h-48 w-48 -translate-y-1/2 text-paper/10" />
      <BrandStripes className="absolute top-1/2 -right-6 h-48 w-48 -translate-y-1/2 text-paper/10" />
      <span className="container-site relative flex min-h-28 items-center justify-center gap-5 py-8 text-center">
        <span className="display text-[clamp(1.375rem,3.4vw,2.5rem)]">Get a free quote for your next project</span>
        <ArrowRightIcon
          size={40}
          weight="light"
          aria-hidden="true"
          className="hidden shrink-0 transition-transform duration-300 group-hover:translate-x-2 sm:block"
        />
      </span>
    </Link>
  );
}
