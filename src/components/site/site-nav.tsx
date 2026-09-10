import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/use-reveal";
import { EffectsToggle } from "./effects";

const ITEMS = [
  { id: "index", label: "Work", mobile: true },
  { id: "aegis", label: "Aegis", mobile: false },
  { id: "lamdan", label: "Lamdan", mobile: false },
  { id: "botforge", label: "BotForge", mobile: false },
  { id: "lab", label: "Lab", mobile: false },
  { id: "contact", label: "Contact", mobile: true, cta: true },
];

export function SiteNav() {
  const active = useActiveSection(ITEMS.map((item) => item.id));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-500",
        scrolled ? "bg-background/90 hairline-b backdrop-blur-md" : "bg-transparent",
      )}
    >
      <nav
        aria-label="Section navigation"
        className="mx-auto flex w-full max-w-[1320px] items-center gap-2 px-3 py-3 sm:gap-4 sm:px-8 lg:px-12"
      >
        <a
          href="#top"
          className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] whitespace-nowrap sm:text-[11px] sm:tracking-[0.22em]"
        >
          A. Perel
          <span className="ml-2 hidden text-muted-foreground lg:inline">/ AI Product Builder</span>
        </a>

        <ul className="ml-auto flex min-w-0 items-center gap-0.5">
          {ITEMS.map((item) => (
            <li key={item.id} className={cn(!item.mobile && "hidden md:block")}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className={cn(
                  "relative block px-1.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] whitespace-nowrap transition-colors sm:px-2 sm:text-[11px] sm:tracking-[0.14em]",
                  item.cta
                    ? "border border-foreground/35 text-foreground hover:bg-foreground hover:text-background"
                    : active === item.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                {!item.cta ? (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-2 -bottom-0.5 h-px origin-left bg-current transition-transform duration-300",
                      active === item.id ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                ) : null}
              </a>
            </li>
          ))}
        </ul>

        <EffectsToggle />
      </nav>
    </header>
  );
}
