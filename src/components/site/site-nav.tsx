import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/use-reveal";

const ITEMS = [
  { id: "index", label: "Index" },
  { id: "aegis", label: "Aegis" },
  { id: "lamdan", label: "Lamdan" },
  { id: "botforge", label: "BotForge" },
  { id: "lab", label: "Lab" },
  { id: "contact", label: "Contact" },
];

export function SiteNav() {
  const active = useActiveSection(ITEMS.map((i) => i.id));
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
        scrolled ? "bg-background/85 hairline-b backdrop-blur-md" : "bg-transparent",
      )}
    >
      <nav
        aria-label="Section navigation"
        className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12"
      >
        <a
          href="#top"
          className="font-mono text-[11px] uppercase tracking-[0.22em] whitespace-nowrap"
        >
          A. Perel
          <span className="ml-2 hidden text-muted-foreground sm:inline">/ AI Product Builder</span>
        </a>

        <ul className="-mx-1 flex min-w-0 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className={cn(
                  "relative block px-2 py-1.5 font-mono text-[11px] tracking-[0.14em] uppercase whitespace-nowrap transition-colors",
                  active === item.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-2 -bottom-0.5 h-px origin-left bg-current transition-transform duration-300",
                    active === item.id ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
