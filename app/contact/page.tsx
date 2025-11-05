import { Mail, MessageSquare } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Contact — Unvios",
  description: "Get in touch with the Unvios team",
};

export default function ContactPage() {
  return (
    <main className="bg-white">
      {/* Header */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help. Reach out to us through any of the channels
            below.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Support */}
            <a
              href="mailto:support@unvios.app"
              className="group bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-orange-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                  <Mail className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Email Support
                  </h3>
                  <p className="text-gray-600 mb-3">
                    For general inquiries, support questions, and feedback.
                  </p>
                  <div className="text-orange-600 font-medium">
                    support@unvios.app
                  </div>
                </div>
              </div>
            </a>

            {/* Sales & Partnerships */}
            <a
              href="mailto:hello@unvios.app"
              className="group bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-orange-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                  <MessageSquare className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Sales & Partnerships
                  </h3>
                  <p className="text-gray-600 mb-3">
                    For business inquiries, enterprise plans, and partnerships.
                  </p>
                  <div className="text-orange-600 font-medium">
                    hello@unvios.app
                  </div>
                </div>
              </div>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/yourusername/unvios"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-orange-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                  <span className="text-2xl">📦</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    GitHub
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Report bugs, request features, or contribute to the project.
                  </p>
                  <div className="text-orange-600 font-medium">
                    View Repository →
                  </div>
                </div>
              </div>
            </a>

            {/* Social */}
            <a
              href="https://twitter.com/unvios_app"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-orange-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                  <span className="text-2xl">🐦</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Social Media
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Follow us for updates, tips, and community discussions.
                  </p>
                  <div className="text-orange-600 font-medium">
                    @unvios_app →
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What's the typical response time?
              </h3>
              <p className="text-gray-600">
                We aim to respond to all inquiries within 24-48 hours during
                business days. Enterprise customers receive priority support.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer enterprise support?
              </h3>
              <p className="text-gray-600">
                Yes! Enterprise customers get dedicated support, custom SLAs,
                and direct access to our engineering team. Contact us at{" "}
                <a
                  href="mailto:hello@unvios.app"
                  className="text-orange-600 hover:underline"
                >
                  hello@unvios.app
                </a>{" "}
                to learn more.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How can I report a security issue?
              </h3>
              <p className="text-gray-600">
                If you've discovered a security vulnerability, please email us
                directly at{" "}
                <a
                  href="mailto:security@unvios.app"
                  className="text-orange-600 hover:underline"
                >
                  security@unvios.app
                </a>
                {". "}We take security seriously and will respond promptly.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I schedule a demo?
              </h3>
              <p className="text-gray-600">
                Absolutely! Email{" "}
                <a
                  href="mailto:hello@unvios.app"
                  className="text-orange-600 hover:underline"
                >
                  hello@unvios.app
                </a>{" "}
                with your preferred times and we'll set up a personalized demo
                for your team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Try Unvios today and experience a smarter way to manage your
              memories and knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-orange-600 rounded-full font-semibold hover:bg-orange-50 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-3 bg-orange-700 text-white rounded-full font-semibold hover:bg-orange-800 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
