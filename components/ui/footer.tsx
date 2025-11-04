import Link from "next/link";

export default function Footer() {
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
              <li>
                <a href="#" className="text-white transition-colors">
                  Roadmap
                </a>
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
                <a href="#" className="text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-white transition-colors">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-white transition-colors">
                  Status
                </a>
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
                <Link href="/terms" className="text-white transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/licenses" className="text-white transition-colors">
                  Licenses
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600"></div>
              <span className="text-xl font-bold text-white">Memora</span>
            </div>
            <div className="text-xs text-gray-400 md:ml-3">
              Science-backed memory augmentation — neuro-inspired indexing, RAG,
              and private vector search
            </div>
          </div>
          <div className="text-sm text-gray-400">
            © 2025 Memora. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
