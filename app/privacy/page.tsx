import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - Memora",
  description:
    "Memora's privacy policy — what we collect, why, and how we protect your data.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="text-base text-muted-foreground mb-4">
        Memora is committed to protecting your privacy. This page explains what
        data we collect, why we collect it, and how you can control it.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Data We Collect</h2>
        <p className="text-sm text-muted-foreground">
          We collect information you provide directly (for example, your account
          details), and content you save as memories (text, voice notes,
          attachments). We also collect limited usage analytics to improve the
          product when you opt-in.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">How We Use Data</h2>
        <p className="text-sm text-muted-foreground">
          Your memories are used to provide search and recall features,
          personalize your experience, and power AI-driven organization. We do
          not sell your personal data.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Cookies & Tracking</h2>
        <p className="text-sm text-muted-foreground">
          We use cookies and local storage for session management and optional
          analytics. You can Accept All or Decline All from the cookie banner.
          If you decline, we will not enable non-essential tracking.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Data Retention & Export</h2>
        <p className="text-sm text-muted-foreground">
          You own your memories. You can export or delete your data from account
          settings. We retain only what is necessary to provide the service and
          comply with legal obligations.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p className="text-sm text-muted-foreground">
          If you have questions about privacy, contact us at{" "}
          <a href="mailto:olserra@gmail.com" className="underline">
            olserra@gmail.com
          </a>{" "}
          .
        </p>
      </section>

      <div className="mt-8">
        <Link href="/" className="text-sm underline">
          Back to home
        </Link>
      </div>
    </main>
  );
}
