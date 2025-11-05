import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  FlaskConical,
  Globe,
  Heart,
  Microscope,
  Network,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Research — Unvios",
  description:
    "Partnering with researchers worldwide in cognitive science, AI, and neuroscience to advance human memory augmentation with a mental health-first approach.",
  openGraph: {
    title: "Research — Unvios",
    description:
      "Partnering with researchers worldwide in cognitive science, AI, and neuroscience to advance human memory augmentation with a mental health-first approach.",
    type: "website",
    images: [
      {
        url: "/metadata-img.png",
        width: 1200,
        height: 630,
        alt: "Unvios - Your Personal Memory Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research — Unvios",
    description:
      "Partnering with researchers worldwide in cognitive science, AI, and neuroscience to advance human memory augmentation.",
    images: ["/metadata-img.png"],
  },
};

export default function ResearchPage() {
  const researchAreas = [
    {
      title: "Cognitive Science",
      icon: <Brain className="h-6 w-6" />,
      desc: "Understanding how human memory works—encoding, consolidation, retrieval—and applying those insights to build better digital memory systems.",
      topics: [
        "Spacing effect & retrieval practice",
        "Working memory capacity",
        "Autobiographical memory organization",
      ],
    },
    {
      title: "AI & Machine Learning",
      icon: <Sparkles className="h-6 w-6" />,
      desc: "Leveraging transformer models, RAG architectures, and embedding spaces to create context-aware memory assistants that enhance rather than replace human cognition.",
      topics: [
        "Vector similarity & semantic search",
        "Personalized language models",
        "Few-shot learning from user data",
      ],
    },
    {
      title: "Neuroscience",
      icon: <Network className="h-6 w-6" />,
      desc: "Drawing from neural mechanisms of memory formation, synaptic plasticity, and pattern completion to inform our augmentation strategies.",
      topics: [
        "Hippocampal indexing theory",
        "Reconsolidation & memory editing",
        "Neural networks as memory models",
      ],
    },
    {
      title: "Mental Health & Well-being",
      icon: <Heart className="h-6 w-6" />,
      desc: "Ensuring memory augmentation supports mental wellness, reduces cognitive load, and respects emotional context—never exploiting vulnerability.",
      topics: [
        "Cognitive offloading & stress reduction",
        "Trauma-informed design",
        "Privacy & psychological safety",
      ],
    },
  ];

  const partnerships = [
    {
      type: "University Labs",
      icon: <Microscope className="h-5 w-5" />,
      examples: [
        "Memory & cognition research groups",
        "Human-computer interaction labs",
        "Computational neuroscience centers",
      ],
    },
    {
      type: "Clinical Researchers",
      icon: <Heart className="h-5 w-5" />,
      examples: [
        "Cognitive behavioral therapy practitioners",
        "Neuropsychology clinics",
        "Mental health technology researchers",
      ],
    },
    {
      type: "AI & ML Institutes",
      icon: <FlaskConical className="h-5 w-5" />,
      examples: [
        "Natural language processing groups",
        "Responsible AI research teams",
        "Privacy-preserving ML labs",
      ],
    },
  ];

  const principles = [
    {
      title: "Open Science",
      desc: "We publish findings, share anonymized datasets (with consent), and contribute to the broader research community.",
    },
    {
      title: "Privacy First",
      desc: "All research follows strict ethical guidelines—no data shared without explicit consent, and privacy-preserving methods are default.",
    },
    {
      title: "Mental Health Centered",
      desc: "Memory augmentation must reduce stress, support well-being, and never manipulate or harm users' psychological state.",
    },
    {
      title: "Interdisciplinary",
      desc: "We bridge cognitive science, AI, neuroscience, and clinical practice to build holistic solutions grounded in human understanding.",
    },
  ];

  const currentProjects = [
    {
      title: "Semantic Memory Networks",
      status: "Active",
      desc: "Mapping how personal memories cluster and connect over time using graph neural networks and embedding spaces.",
      partners: "MIT Media Lab, Stanford HCI Group",
    },
    {
      title: "Emotional Context & Recall",
      status: "Active",
      desc: "Understanding how emotional valence affects memory retrieval and building sentiment-aware search algorithms.",
      partners: "UC Berkeley Cognitive Neuroscience Lab",
    },
    {
      title: "Cognitive Load Metrics",
      status: "Planning",
      desc: "Developing validated measures of cognitive offloading effectiveness and stress reduction in daily memory tasks.",
      partners: "Oxford Internet Institute, Carnegie Mellon HCI",
    },
    {
      title: "Privacy-Preserving Embeddings",
      status: "Active",
      desc: "Exploring federated learning and differential privacy techniques for personal memory systems that never expose raw user data.",
      partners: "EPFL Security & Privacy Lab",
    },
  ];

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-orange-50 via-red-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-medium mb-6">
            <Globe className="w-4 h-4" />
            Open Research Partnerships
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Advancing Human Memory
            <br />
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Through Science & Collaboration
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            We partner with researchers worldwide in cognitive science, AI, and
            neuroscience to build memory augmentation systems that enhance human
            potential while prioritizing mental health, privacy, and well-being.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="#partners">
              <Button
                size="lg"
                className="bg-orange-600 text-white px-6 py-4 rounded-full hover:bg-orange-700"
              >
                Partner with us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#projects">
              <Button
                size="lg"
                variant="outline"
                className="px-6 py-4 rounded-full"
              >
                Current projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Our Research Areas
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              We work at the intersection of multiple disciplines to understand
              and augment human memory in meaningful, responsible ways.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchAreas.map((area) => (
              <div
                key={area.title}
                className="p-6 rounded-2xl border bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white mb-4">
                  {area.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {area.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{area.desc}</p>
                <div className="space-y-2">
                  {area.topics.map((topic) => (
                    <div
                      key={topic}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <Zap className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Principles */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Our Research Principles
            </h2>
            <p className="text-gray-600 mt-2">
              Guiding values that shape how we approach memory augmentation
              research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((principle, idx) => (
              <div
                key={principle.title}
                className="p-6 bg-white rounded-xl border shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{principle.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Projects */}
      <section id="projects" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Current Research Projects
            </h2>
            <p className="text-gray-600 mt-2">
              Active and planned research initiatives with academic and clinical
              partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentProjects.map((project) => (
              <div
                key={project.title}
                className="p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{project.desc}</p>
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <Users className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{project.partners}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section
        id="partners"
        className="py-16 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Who We Partner With
            </h2>
            <p className="text-gray-600 mt-2">
              We collaborate with diverse research institutions and clinicians
              worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnerships.map((partnership) => (
              <div
                key={partnership.type}
                className="p-6 bg-white rounded-xl border shadow-sm"
              >
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-orange-100 text-orange-600 mb-4">
                  {partnership.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {partnership.type}
                </h3>
                <ul className="space-y-2">
                  {partnership.examples.map((example) => (
                    <li
                      key={example}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-orange-600 to-orange-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Research Community
          </h2>
          <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
            Whether you're a researcher, clinician, or student working on
            memory, cognition, AI, or mental health—we'd love to explore
            collaboration opportunities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-orange-600 px-6 py-4 rounded-full hover:bg-gray-100"
            >
              Get in touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-orange-600 px-6 py-4 rounded-full hover:bg-white/10"
            >
              View publications
            </Button>
          </div>
          <p className="mt-6 text-sm text-orange-200">
            Email us at{" "}
            <a
              href="mailto:research@unvios.ai"
              className="underline hover:text-gray-500"
            >
              research@unvios.ai
            </a>
          </p>
        </div>
      </section>

      {/* Latest Insights */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Latest Research Insights
            </h2>
            <p className="text-gray-600 mt-2">
              Recent findings and developments from our research partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Memory Consolidation in Digital Systems",
                date: "October 2024",
                desc: "How spacing algorithms can improve long-term retention in personal knowledge bases.",
                link: "#",
              },
              {
                title: "Ethical AI for Mental Health",
                date: "September 2024",
                desc: "Frameworks for building memory assistants that respect psychological safety and autonomy.",
                link: "#",
              },
              {
                title: "Vector Embeddings & Human Memory",
                date: "August 2024",
                desc: "Comparing semantic similarity in neural networks with human associative memory structures.",
                link: "#",
              },
            ].map((insight) => (
              <div
                key={insight.title}
                className="p-6 rounded-xl border bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="text-xs text-orange-600 font-medium mb-2">
                  {insight.date}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {insight.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{insight.desc}</p>
                <div className="text-sm text-orange-600 font-medium flex items-center gap-1">
                  Read more
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
