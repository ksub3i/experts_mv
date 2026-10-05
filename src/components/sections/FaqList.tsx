import { PlusIcon } from "@phosphor-icons/react/ssr";
import type { FaqItem } from "@/content/faq";

/**
 * Accessible accordion built on native <details>/<summary>: keyboard and
 * screen-reader support with no JavaScript.
 */
export function FaqList({ items, tone = "light" }: { items: FaqItem[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div className={dark ? "divide-y divide-line-inverse border-y border-line-inverse" : "divide-y divide-line border-y border-line"}>
      {items.map((item) => (
        <details key={item.id} id={`faq-${item.id}`} className="group scroll-mt-28">
          <summary
            className={
              "flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg font-semibold [&::-webkit-details-marker]:hidden " +
              (dark ? "text-paper hover:text-highlight" : "text-ink hover:text-accent")
            }
          >
            {item.question}
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center bg-accent text-on-accent transition-transform duration-200 group-open:rotate-45"
            >
              <PlusIcon size={18} weight="bold" />
            </span>
          </summary>
          <p className={"max-w-3xl pr-14 pb-6 leading-relaxed " + (dark ? "text-muted-inverse" : "text-muted")}>
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
