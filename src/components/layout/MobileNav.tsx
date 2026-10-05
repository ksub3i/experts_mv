"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ListIcon, XIcon, ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import type { NavItem } from "@/lib/types";
import { Logo } from "@/components/ui/Logo";
import { buttonClasses } from "@/components/ui/Button";

/**
 * Full-screen mobile menu built on the native <dialog> element, which gives
 * focus trapping, Esc-to-close and an inert background for free.
 */
export function MobileNav({ nav, estimateHref, pathname }: { nav: NavItem[]; estimateHref: string; pathname: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  // Close after navigating.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={open}
        className="flex h-12 w-12 cursor-pointer items-center justify-center"
        aria-label="Open menu"
        aria-haspopup="dialog"
      >
        <ListIcon size={28} aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        className="on-dark m-0 h-dvh max-h-none w-full max-w-none bg-ink text-paper backdrop:bg-ink/60 open:animate-[rise_0.35s_var(--ease-out-expo)]"
      >
        <div className="container-site flex h-20 items-center justify-between">
          <Logo variant="reversed" />
          <button
            type="button"
            onClick={close}
            className="flex h-12 w-12 cursor-pointer items-center justify-center"
            aria-label="Close menu"
          >
            <XIcon size={28} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile" className="container-site flex flex-col gap-10 pt-10 pb-12">
          <ul className="flex flex-col gap-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                  className="display block py-2 text-5xl aria-[current=page]:text-outline [--outline:var(--color-paper)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={estimateHref} onClick={close} className={buttonClasses("primary", "self-start")}>
            Get Your Free Project Estimate
            <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
          </Link>
        </nav>
      </dialog>
    </div>
  );
}
