import { getPostBySlug } from "@/lib/blog";
import Link from "next/link";
import ClientFallback from "./ClientFallback";

type Props = { params: { slug: string } };

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return (
      // Server couldn't resolve the post — render a client fallback that
      // attempts to extract the slug from window.location and match posts.
      <ClientFallback params={params} />
    );
  }

  return (
    <main className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/blog" className="text-gray-500 hover:underline">
            ← Back to blog
          </Link>
        </div>

        {post.image && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img
              src={post.image}
              alt={post.imageAlt || post.title}
              className="w-full h-auto object-cover"
              style={{ maxHeight: "400px" }}
            />
          </div>
        )}

        <article>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="text-sm text-gray-500 mb-8">
            {formatDate(post.date)}
          </div>
          <div className="prose prose-lg max-w-none">
            {post.content.split("\n").map((line, i) => {
              // Simple markdown-like rendering
              if (line.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="text-3xl font-bold text-gray-900 mt-12 mb-4"
                  >
                    {line.replace("## ", "")}
                  </h2>
                );
              }
              if (line.startsWith("### ")) {
                return (
                  <h3
                    key={i}
                    className="text-2xl font-semibold text-gray-900 mt-8 mb-3"
                  >
                    {line.replace("### ", "")}
                  </h3>
                );
              }
              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={i} className="font-bold text-gray-900 mt-6 mb-2">
                    {line.replace(/\*\*/g, "")}
                  </p>
                );
              }
              if (line.startsWith("- ")) {
                return (
                  <li
                    key={i}
                    className="ml-6 text-gray-700 leading-relaxed mb-2"
                  >
                    {line
                      .replace("- ", "")
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/<strong>(.*?)<\/strong>/g, (_, p1) => p1)}
                  </li>
                );
              }
              if (line.trim() === "---") {
                return <hr key={i} className="my-8 border-gray-200" />;
              }
              if (line.trim() === "") {
                return <div key={i} className="h-4" />;
              }
              // Regular paragraph with inline bold support
              const withBold = line.replace(
                /\*\*(.*?)\*\*/g,
                '<strong class="font-semibold text-gray-900">$1</strong>'
              );
              const withItalic = withBold.replace(
                /\*(.*?)\*/g,
                '<em class="italic">$1</em>'
              );

              return (
                <p
                  key={i}
                  className="text-gray-700 leading-relaxed mb-4 text-lg"
                  dangerouslySetInnerHTML={{ __html: withItalic }}
                />
              );
            })}
          </div>
        </article>
      </div>
    </main>
  );
}

// If the server couldn't resolve the post, render a client-side fallback
// which will attempt to parse the URL and render the post client-side.
