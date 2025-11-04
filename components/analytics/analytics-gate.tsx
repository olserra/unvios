"use client";

import { Analytics } from "@vercel/analytics/next";
import * as React from "react";

const COOKIE_NAME = "memora_cookie_consent";

function readConsent(): string | null {
  try {
    const cookieRegex = new RegExp(String.raw`(^|;)\s*${COOKIE_NAME}\s*=\s*([^;]+)`);
    const m = cookieRegex.exec(document.cookie);
    if (m) return m[2];
    return localStorage.getItem(COOKIE_NAME);
  } catch {
    return null;
  }
}

export default function AnalyticsGate() {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const consent = readConsent();
    if (consent === "accepted") setEnabled(true);

    const handler = (e: Event) => {
      try {
        // detail has consent
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const detail = e?.detail;
        if (detail?.consent === "accepted") setEnabled(true);
        if (detail?.consent === "declined") setEnabled(false);
      } catch (err) {
        // Log the error so it's handled rather than silently ignored
        // This helps with debugging unexpected event payloads in production.
        // Avoid throwing here to keep the event handling non-fatal.
        // eslint-disable-next-line no-console
        console.error("Failed to handle memora:cookie-consent event:", err);
      }
    };

    globalThis.addEventListener("memora:cookie-consent", handler as EventListener);
    return () =>
      globalThis.removeEventListener(
        "memora:cookie-consent",
        handler as EventListener
      );
  }, []);

  if (!enabled) return null;

  return <Analytics />;
}
