"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";

const COOKIE_NAME = "memora_cookie_consent";

function setConsent(value: "accepted" | "declined") {
  try {
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    const secure =
      typeof globalThis !== "undefined" &&
      typeof (globalThis as any).location === "object" &&
      (globalThis as any).location.protocol === "https:"
        ? "; Secure"
        : "";
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
    // also mirror to localStorage for quick checks if cookies are blocked
    try {
      localStorage.setItem(COOKIE_NAME, value);
    } catch (e) {
      console.error("Error setting cookie consent in localStorage:", e);
    }
  } catch (e) {
    console.error("Error setting cookie consent:", e);
  }
}

function getConsent(): string | null {
  try {
    // prefer cookie
    const regex = new RegExp(
      String.raw`(^|;)\s*` + COOKIE_NAME + String.raw`\s*=\s*([^;]+)`
    );
    const matched = regex.exec(document.cookie);
    if (matched) return matched[2] ?? null;
    // fallback to localStorage
    return localStorage.getItem(COOKIE_NAME);
  } catch (e) {
    console.error("Error getting cookie consent:", e);
    return null;
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const consent = getConsent();
    if (!consent) setVisible(true);
  }, []);

  const accept = React.useCallback(() => {
    setConsent("accepted");
    setVisible(false);
    // optional: emit a window event so other client code can initialize analytics
    if (
      typeof globalThis !== "undefined" &&
      typeof (globalThis as any).dispatchEvent === "function" &&
      typeof (globalThis as any).CustomEvent === "function"
    ) {
      (globalThis as any).dispatchEvent(
        new (globalThis as any).CustomEvent("memora:cookie-consent", {
          detail: { consent: "accepted" },
        })
      );
    }
  }, []);

  const decline = React.useCallback(() => {
    setConsent("declined");
    setVisible(false);
    if (
      typeof globalThis !== "undefined" &&
      typeof (globalThis as any).dispatchEvent === "function" &&
      typeof (globalThis as any).CustomEvent === "function"
    ) {
      (globalThis as any).dispatchEvent(
        new (globalThis as any).CustomEvent("memora:cookie-consent", {
          detail: { consent: "declined" },
        })
      );
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-6 z-50 pointer-events-auto">
      <div className="mx-auto max-w-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1 text-sm text-muted-foreground dark:text-muted-foreground">
          <div className="font-medium text-sm text-foreground dark:text-foreground">
            We use cookies to improve your experience
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            By choosing <strong>Accept All</strong> you consent to the use of
            cookies for analytics and personalization. Choose{" "}
            <strong>Decline All</strong> to disable non-essential cookies.{" "}
            <Link href="/privacy" className="underline ml-1">
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={decline}>
            Decline All
          </Button>
          <Button variant="default" size="sm" onClick={accept}>
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
