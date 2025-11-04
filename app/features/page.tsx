import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  MessageSquare,
  Shield,
  Zap,
  Target,
  Check,
  Activity,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      title: "WhatsApp Native",
      icon: <MessageSquare className="h-6 w-6" />,
      desc: "Capture and recall directly where you already communicate—no new app to learn.",
    },
    {
      title: "AI Organization",
      icon: <Brain className="h-6 w-6" />,
      desc: "Automatic tagging, linking and summary generation so your memories become instantly useful.",
    },
    {
      title: "Voice & Call Transcription",
      icon: <Zap className="h-6 w-6" />,
      desc: "High-quality transcription (50+ languages) from voice notes and recorded calls.",
    },
    {
      title: "Privacy-first",
      icon: <Shield className="h-6 w-6" />,
      desc: "End-to-end encryption and clear data ownership—your memories belong to you.",
    },
    {
      title: "Contextual Recall",
      icon: <Target className="h-6 w-6" />,
      desc: "Ask questions in natural language and get answers drawn from your personal memories.",
    },
    {
      title: "Insights & Metrics",
      icon: <Activity className="h-6 w-6" />,
      desc: "Understand your learning and thinking patterns with easy-to-read analytics.",
    },
  ];

  return (
    <main className="bg-white">
      <section className="py-24 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            AI-Powered Memory Assistant
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Features built to remember more</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Memora turns scattered conversations and voice notes into a searchable, private knowledge base—available where you already communicate.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/sign-in">
              <Button size="lg" className="bg-orange-600 text-white px-6 py-4 rounded-full">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="px-6 py-4 rounded-full">
                See pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Core capabilities</h2>
            <p className="text-gray-600 mt-2">Everything you need to capture, organize and recall—effortlessly.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-orange-50 text-orange-600 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Integrations & workflows</h2>
              <p className="text-gray-600 mb-6">Memora is designed to fit your flow. Capture from WhatsApp, import notes, or connect with other tools via webhooks and exports.</p>
              <ul className="space-y-3">
                {["WhatsApp contact integration","Export (JSON, CSV, PDF)","Webhook & Zapier friendly","API & custom automations"].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center mt-1">
                      <Check className="w-4 h-4" />
                    </div>
                    <div className="text-gray-700">{i}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & control</h3>
              <p className="text-gray-600 mb-4">You keep full control of your data. Memora provides export tools, account deletion, and end-to-end encryption so your private memories stay private.</p>
              <div className="flex gap-3 flex-wrap">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">End-to-end encryption</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Data export</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Access controls</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get better recall, faster</h2>
          <p className="text-gray-600 mb-8">Memora combines on-device-like convenience with powerful server-side AI so you get instant answers without sacrificing privacy or control.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/sign-in">
              <Button className="bg-orange-600 text-white px-6 py-3 rounded-full">Start free</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="px-6 py-3 rounded-full">Compare plans</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to put your memory on autopilot?</h2>
          <p className="mb-8 text-orange-100">Start capturing ideas today. Fast setup, private by design.</p>
          <Link href="/sign-in">
            <Button size="lg" className="bg-white text-orange-600 px-8 py-4 rounded-full">
              Get started free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
