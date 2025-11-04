import Link from "next/link";

export const metadata = {
  title: "Terms of Service - Memora",
  description:
    "Memora's terms of service — the rules and guidelines for using our memory management platform.",
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="text-base text-muted-foreground mb-4">
        By using Memora, you agree to these terms. Please read them carefully.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Acceptance of Terms</h2>
        <p className="text-sm text-muted-foreground">
          By accessing or using Memora, you agree to be bound by these Terms of
          Service and all applicable laws and regulations. If you do not agree
          with any of these terms, you are prohibited from using or accessing
          this service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Use License</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Permission is granted to use Memora for personal or commercial memory
          management purposes, subject to the following restrictions:
        </p>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
          <li>You must not modify or copy the materials without permission</li>
          <li>
            You must not use the materials for any commercial purpose without a
            valid subscription
          </li>
          <li>
            You must not attempt to reverse engineer any software contained in
            Memora
          </li>
          <li>
            You must not remove any copyright or proprietary notations from the
            materials
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">User Account</h2>
        <p className="text-sm text-muted-foreground">
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activities that occur under your
          account. You must notify us immediately of any unauthorized use of
          your account.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">User Content</h2>
        <p className="text-sm text-muted-foreground">
          You retain all rights to the memories and content you store in Memora.
          By using our service, you grant us permission to store, process, and
          display your content solely for the purpose of providing the service
          to you. We do not claim ownership of your content.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">AI Features</h2>
        <p className="text-sm text-muted-foreground">
          Memora may use AI and machine learning to organize, search, and recall
          your memories. By using these features, you acknowledge that AI
          systems may occasionally produce unexpected results, and you use them
          at your own discretion.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Prohibited Uses</h2>
        <p className="text-sm text-muted-foreground mb-2">
          You may not use Memora to:
        </p>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
          <li>Violate any laws or regulations</li>
          <li>Infringe on intellectual property rights</li>
          <li>Transmit harmful, offensive, or illegal content</li>
          <li>Engage in automated data collection or scraping</li>
          <li>Interfere with or disrupt the service or servers</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Service Availability</h2>
        <p className="text-sm text-muted-foreground">
          We strive to keep Memora available and functional, but we do not
          guarantee uninterrupted access. We may modify, suspend, or discontinue
          any part of the service at any time with or without notice.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Payments & Subscriptions</h2>
        <p className="text-sm text-muted-foreground">
          Some features may require a paid subscription. All fees are
          non-refundable unless required by law. You may cancel your
          subscription at any time, and you will retain access until the end of
          your current billing period.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Disclaimer</h2>
        <p className="text-sm text-muted-foreground">
          Memora is provided "as is" without any warranties, express or implied.
          We do not warrant that the service will be error-free, secure, or
          available at all times. Your use of the service is at your sole risk.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
        <p className="text-sm text-muted-foreground">
          In no event shall Memora or its suppliers be liable for any damages
          (including, without limitation, damages for loss of data or profit, or
          due to business interruption) arising out of the use or inability to
          use Memora, even if we have been notified of the possibility of such
          damage.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Termination</h2>
        <p className="text-sm text-muted-foreground">
          We may terminate or suspend your access to Memora immediately, without
          prior notice or liability, for any reason, including if you breach
          these Terms. Upon termination, your right to use the service will
          cease immediately.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Changes to Terms</h2>
        <p className="text-sm text-muted-foreground">
          We reserve the right to modify these terms at any time. We will notify
          users of any material changes via email or through the service.
          Continued use of Memora after changes constitutes acceptance of the
          new terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Governing Law</h2>
        <p className="text-sm text-muted-foreground">
          These terms shall be governed by and construed in accordance with the
          laws of the jurisdiction in which Memora operates, without regard to
          its conflict of law provisions.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p className="text-sm text-muted-foreground">
          If you have questions about these terms, contact us at{" "}
          <a href="mailto:olserra@gmail.com" className="underline">
            olserra@gmail.com
          </a>{" "}
          .
        </p>
      </section>

      <div className="mt-8 flex gap-4">
        <Link href="/" className="text-sm underline">
          Back to home
        </Link>
        <Link href="/privacy" className="text-sm underline">
          Privacy Policy
        </Link>
      </div>
    </main>
  );
}
