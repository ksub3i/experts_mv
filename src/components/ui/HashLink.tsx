"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Link to `/path#hash`. When already on `/path`, it sets `location.hash`
 * directly so a native `hashchange` fires (Next's client navigation doesn't),
 * letting components such as the service slider react to it.
 */
export function HashLink({ href, ...props }: React.ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname();
  const [path, hash] = href.split("#");

  return (
    <Link
      href={href}
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        if (!hash || path !== pathname || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        if (window.location.hash === `#${hash}`) window.dispatchEvent(new HashChangeEvent("hashchange"));
        else window.location.hash = hash;
      }}
    />
  );
}
