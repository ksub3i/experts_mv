export function PartnerStrip({ partners }: { partners: { name: string }[] }) {
  return (
    <section aria-labelledby="partners-heading" className="border-y border-line bg-surface py-14">
      <div className="container-site">
        <h2 id="partners-heading" className="eyebrow text-center text-muted">
          Trusted material partners
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((p) => (
            // PLACEHOLDER — replace each tile with the partner's logo SVG.
            <li
              key={p.name}
              className="flex h-20 items-center justify-center border border-dashed border-placeholder-ink/40 text-xs font-semibold tracking-widest text-placeholder-ink uppercase"
            >
              {p.name} logo
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
