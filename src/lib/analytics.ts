type AnalyticsValue = string | number | boolean | null;
type AnalyticsData = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    va?: (...args: unknown[]) => void;
    vaq?: unknown[][];
  }
}

export function trackEvent(name: string, data?: AnalyticsData) {
  if (typeof window === "undefined") return;
  window.va?.("event", data ? { name, data } : { name });
}

export function installConversionTracking() {
  if (typeof document === "undefined") return () => {};

  const onClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest("a");
    if (!(anchor instanceof HTMLAnchorElement)) return;

    const rawHref = anchor.getAttribute("href") ?? "";
    const href = anchor.href;

    if (rawHref === "#contact") {
      trackEvent("contact_click", { location: "site" });
      return;
    }

    if (rawHref.startsWith("mailto:")) {
      trackEvent("contact_click", { location: "email" });
      return;
    }

    if (href.includes("linkedin.com/")) {
      trackEvent("linkedin_click", { location: "site" });
      return;
    }

    if (href.includes("github.com/")) {
      const path = new URL(href).pathname.replace(/^\//, "").slice(0, 80);
      trackEvent("github_click", { target: path || "profile" });
      return;
    }

    if (/\/cv\.pdf(?:$|[?#])/.test(href)) {
      trackEvent("cv_download", { format: "pdf" });
      return;
    }

    if (/\/cv(?:$|[/?#])/.test(href)) {
      trackEvent("cv_open", { format: "web" });
      return;
    }

    const caseMatch = href.match(/\/work\/(aegis|lamdan|botforge)\/?/);
    if (caseMatch?.[1]) {
      trackEvent("case_open", { case: caseMatch[1] });
    }
  };

  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}
