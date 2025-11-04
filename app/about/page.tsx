import MiniPlayground from "@/components/about/MiniPlayground";
import { Clock, Layers } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About — Memora",
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Compact header */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Memora Lab</h1>
              <p className="mt-2 text-gray-600">
                A different view: experiments, timelines, and live previews from
                our research lab.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-full"
              >
                Open Preview
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard-style content: left timeline (dark), right metrics + playground */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: timeline */}
            <div className="lg:col-span-5">
              <div className="bg-gray-900 text-gray-100 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600" />
                  <div>
                    <div className="text-lg font-semibold">Milestones</div>
                    <div className="text-sm text-gray-300">
                      Research highlights and delivery checkpoints
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mt-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        Vector-backed recall
                      </div>
                      <div className="text-xs text-gray-400">
                        Q2 2024 — Productionized dense indexing
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">RAG grounding</div>
                      <div className="text-xs text-gray-400">
                        Q3 2024 — Reduced hallucinations by experiment
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        Privacy defaults
                      </div>
                      <div className="text-xs text-gray-400">
                        Q1 2025 — Local dev-mode & encrypted transport
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-800 pt-4 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-300" />
                      Lab cadence: weekly experiments & monthly reviews
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Layers className="w-4 h-4 text-gray-300" />
                      Stack: Postgres + vector extensions, private embedding
                      store
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: metrics + playground */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-sm text-gray-500">Embeddings</div>
                  <div className="text-2xl font-bold">1.23M</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-sm text-gray-500">Median recall</div>
                  <div className="text-2xl font-bold">320ms</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-sm text-gray-500">Experiments</div>
                  <div className="text-2xl font-bold">12</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Mini playground
                    </div>
                    <div className="text-xs text-gray-500">
                      Run a quick, local mock of the RAG flow
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Preview</div>
                </div>
                <MiniPlayground />
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-gray-100">
                  <div className="text-sm font-medium text-gray-900">
                    Research notes
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    <li>
                      <a
                        href="https://arxiv.org/abs/2004.14991"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-orange-600"
                      >
                        Dense Passage Retrieval
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://arxiv.org/abs/2005.11401"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-orange-600"
                      >
                        RAG: Retrieval-Augmented Generation
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-100">
                  <div className="text-sm font-medium text-gray-900">
                    Get involved
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Join the research preview via the dashboard or open a
                    conversation on our community channels.
                  </div>
                  <div className="mt-4">
                    <Link href="/login" className="text-sm text-orange-600">
                      Join preview
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
