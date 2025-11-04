import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="bg-white">
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900">$0</div>
                <div className="text-gray-500 mt-2">Forever free</div>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "100 memories/month",
                  "Text capture",
                  "Basic search",
                  "WhatsApp integration",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full rounded-full" variant="outline">
                Start Free
              </Button>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 rounded-3xl border-2 border-orange-600 relative transform md:scale-105 shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-orange-600 text-sm font-bold px-4 py-1 rounded-full">
                POPULAR
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <div className="text-4xl font-bold text-white">$12</div>
                <div className="text-orange-100 mt-2">per month</div>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited memories",
                  "Voice transcription",
                  "Call recording",
                  "AI search & insights",
                  "Priority support",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full rounded-full bg-white text-orange-600 hover:bg-orange-50">
                Start Pro Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="bg-white p-8 rounded-3xl border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Team</h3>
                <div className="text-4xl font-bold text-gray-900">$29</div>
                <div className="text-gray-500 mt-2">per user/month</div>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Everything in Pro",
                  "Shared team memories",
                  "Admin controls",
                  "Team analytics",
                  "Dedicated support",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full rounded-full bg-orange-600 text-white hover:bg-orange-700">
                Contact Sales
              </Button>
            </div>
          </div>

          <div className="mt-12 text-center max-w-2xl mx-auto text-sm text-gray-600">
            <p>
              Need a custom plan?{" "}
              <Link href="/contact" className="text-orange-600 underline">
                Contact our sales team
              </Link>{" "}
              and we'll tailor something for your organization.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
