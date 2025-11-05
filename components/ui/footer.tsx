import Link from "next/link";
import { TiSpiral } from "react-icons/ti";
// using simple emoji for social icons to avoid deprecated lucide exports

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-white transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/research" className="text-white transition-colors">
                  Research
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <span className="text-white transition-colors">
                  Documentation
                </span>
              </li>
              <li>
                <span className="text-white transition-colors">API</span>
              </li>
              <li>
                <span className="text-white transition-colors">Status</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <a href="/terms" className="text-white transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="flex items-center gap-2">
              <TiSpiral className="w-8 h-8 text-orange-500" />
              <span className="text-xl font-bold text-white">Unvios</span>
            </div>
            <div className="text-xs text-gray-400 md:ml-3">
              Science-backed memory augmentation — neuro-inspired indexing, RAG,
              and private vector search
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-400">
              © {year} Unvios. All rights reserved.
            </div>
            <div className="h-6 w-px bg-gray-800" aria-hidden />
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white transition-colors hover:text-orange-400"
                aria-label="Unvios on Twitter"
              >
                <span aria-hidden className="text-2xl">
                  🐦
                </span>
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white transition-colors hover:text-orange-400"
                aria-label="Unvios on LinkedIn"
              >
                <span aria-hidden className="text-2xl">
                  💼
                </span>
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white transition-colors hover:text-orange-400"
                aria-label="Unvios on GitHub"
              >
                <span aria-hidden className="text-2xl">
                  🐙
                </span>
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
