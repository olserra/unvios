import { posts } from "@/lib/blog";
import Link from "next/link";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogPage() {
  return (
    <main className="bg-white">
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">Blog</h1>
            <p className="mt-4 text-lg text-gray-600">
              Insights, product updates, and short guides about remembering
              better with Unvios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {post.title}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {formatDate(post.date)}
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{post.excerpt}</p>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-orange-600 font-medium hover:underline"
                  >
                    Read post &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
