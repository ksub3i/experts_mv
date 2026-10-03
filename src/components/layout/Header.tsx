"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import type { NavItem } from "@/lib/types";
import { cx } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { buttonClasses } from "@/components/ui/Button";
import { MobileNav } from "./MobileNav";

/** Routes that open with a dark, full-bleed hero (header starts transparent). */
const DARK_HERO = [/^\/$/, /^\/about/, /^\/services/, /^\/projects\//];

export function Header({ nav, quoteHref }: { nav: NavItem[]; quoteHref: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overHero = DARK_HERO.some((r) => r.test(pathname)) && !scrolled;

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,color] duration-300",
        overHero ? "on-dark bg-transparent text-paper" : "bg-paper/95 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur",
      )}
    >
      <div className="container-site flex h-20 items-center justify-between gap-6">
        <Link href="/" className="shrink-0">
          <Logo variant={overHero ? "reversed" : "full-colour"} alt="The Experts — home" priority />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-10 lg:flex">
          <ul className="flex items-center gap-8">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "eyebrow relative py-2 transition-opacity hover:opacity-70",
                      "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-brand-red after:transition-transform",
                      active ? "after:scale-x-100" : "after:scale-x-0",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link href={quoteHref} className={buttonClasses("primary", "on-accent")}>
            Get a free quote
            <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
          </Link>
        </nav>

        <MobileNav nav={nav} quoteHref={quoteHref} pathname={pathname} />
      </div>
    </header>
  );
}
