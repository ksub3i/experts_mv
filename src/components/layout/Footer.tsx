import Link from "next/link";
import Image from "next/image";
import {
  MapPinIcon,
  DeviceMobileIcon,
  PhoneIcon,
  FacebookLogoIcon,
  InstagramLogoIcon,
  XLogoIcon,
  TiktokLogoIcon,
} from "@phosphor-icons/react/ssr";
import type { Service, SiteConfig, SocialLink } from "@/lib/types";
import { Logo } from "@/components/ui/Logo";
import { HashLink } from "@/components/ui/HashLink";

const socialIcons: Record<SocialLink["network"], typeof FacebookLogoIcon> = {
  facebook: FacebookLogoIcon,
  instagram: InstagramLogoIcon,
  x: XLogoIcon,
  tiktok: TiktokLogoIcon,
};

export function Footer({ site, services }: { site: SiteConfig; services: Service[] }) {
  const heading = "eyebrow mb-6 text-highlight";
  const link = "text-sm text-muted-inverse transition-colors hover:text-paper";
  const icon = "shrink-0 text-brand-red";

  return (
    <footer className="on-dark relative overflow-hidden bg-ink text-paper">
      {/* Large faded logomark watermark */}
      <Image
        src="/brand/logomark_white.svg"
        alt=""
        width={116}
        height={126}
        unoptimized
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -bottom-24 h-auto w-[26rem] opacity-[0.04]"
      />

      <div className="container-site relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr] lg:py-20">
        <div>
          <Link href="/" className="mb-8 inline-block">
            <Logo variant="reversed" alt="The Experts — home" />
          </Link>
          <h2 className={heading}>Get in touch</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-muted-inverse">
              <MapPinIcon size={20} className={`mt-px ${icon}`} aria-hidden="true" />
              <span>
                {site.address}
                <br />
                Serving {site.serviceArea}
              </span>
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className={`${link} flex items-center gap-3`}>
                <PhoneIcon size={20} className={icon} aria-hidden="true" />
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`tel:${site.mobile.replace(/[^\d+]/g, "")}`} className={`${link} flex items-center gap-3`}>
                <DeviceMobileIcon size={20} className={icon} aria-hidden="true" />
                {site.mobile}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className={heading}>Our services</h2>
          <ul className="space-y-3">
            {services.map((s) => (
              <li key={s.slug}>
                <HashLink href={`/services#service-${s.slug}`} className={link}>
                  {s.title}
                </HashLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="display mb-3 text-2xl">Follow along</h2>
          <p className="mb-6 max-w-sm text-sm text-muted-inverse">
            Projects in progress, finished homes and tips from the team.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {site.socials.map((s) => {
              const Glyph = socialIcons[s.network];
              return (
                <li key={s.network}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-14 items-center gap-3 border border-line-inverse px-4 py-3 transition-colors hover:border-brand-red hover:bg-ink-soft"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-brand-red text-paper transition-transform group-hover:-translate-y-0.5">
                      <Glyph size={20} weight="fill" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 leading-tight">
                      <span className="block text-sm font-semibold text-paper">{s.label}</span>
                      <span className="block truncate text-xs text-muted-inverse">{s.handle}</span>
                    </span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="container-site relative flex flex-col gap-2 border-t border-line-inverse py-6 text-xs text-muted-inverse sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <p>Site design credit</p>
      </div>
    </footer>
  );
}
