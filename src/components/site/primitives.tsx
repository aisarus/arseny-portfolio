import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/use-reveal";

export function Shell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}

export function Reveal({
  children,
  className,
  delay,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "p" | "span";
}) {
  const { ref, visible } = useReveal<HTMLDivElement>({ delay: delay ?? 0 });
  return (
    // @ts-expect-error polymorphic tag
    <As ref={ref} data-visible={visible} className={cn("reveal", className)}>
      {children}
    </As>
  );
}

export function SectionHead({
  index,
  kicker,
  title,
  lede,
  className,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("hairline-t pt-6", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span className="label-mono">
          {index} / {kicker}
        </span>
        <span className="label-mono hidden sm:inline">arseniy perel</span>
      </div>
      <Reveal className="mt-8">
        <h2 className="display-xl text-[clamp(2.1rem,6.5vw,4.6rem)] max-w-[16ch]">{title}</h2>
      </Reveal>
      {lede ? (
        <Reveal delay={80}>
          <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            {lede}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="label-mono inline-flex items-center border border-current/25 px-2 py-1 text-foreground/70">
      {children}
    </span>
  );
}

export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "group inline-flex items-baseline gap-2 border-b border-current/30 pb-0.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors hover:border-current",
        className,
      )}
    >
      {children}
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
        ↗
      </span>
    </a>
  );
}
