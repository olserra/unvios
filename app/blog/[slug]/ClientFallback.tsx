"use client";

import { getAllPosts, getPostBySlug } from "@/lib/blog";
import Link from "next/link";
import { useEffect, useState } from "react";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
  imageAlt?: string;
};

export default function ClientFallback() {
  const [post, setPost] = useState<Post | null>(null);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    // attempt to extract slug from the current pathname
    try {
      const path = window.location.pathname || "";
      const parts = path.split("/").filter(Boolean);
      const slug = parts[parts.length - 1] || "";
      const decoded = decodeURIComponent(slug).toLowerCase().trim();
      const found = getPostBySlug(decoded) as Post | null;
      if (found) setPost(found);
    } catch (e) {
      // ignore
    } finally {
      setTried(true);
    }
  }, []);

  if (!tried) {
    return (
      <main className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gray-600">Checking URL for matching post…</div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
          <p className="mt-4 text-gray-600">Couldn't find that article.</p>
          <div className="mt-4 text-left text-sm text-gray-500">
            <div className="mb-2">
              <strong>Debug (client):</strong>
            </div>
            <div>
              <div className="font-medium">Available slugs:</div>
              <pre className="whitespace-pre-wrap text-xs bg-gray-100 p-2 rounded mt-1 text-gray-700">
                {JSON.stringify(
                  getAllPosts().map((p) => p.slug),
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/blog" className="text-orange-600 hover:underline">
              Back to blog
            </Link>
          </div>
        </div>
      </main>
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
            {new Date(post.date).toLocaleDateString()}
          </div>
          <div className="prose prose-lg max-w-none">
            {post.content.split("\n").map((line, idx) => {
              const key = `line-${idx}-${line.substring(0, 20)}`;
              if (line.startsWith("## ")) {
                return (
                  <h2
                    key={key}
                    className="text-3xl font-bold text-gray-900 mt-12 mb-4"
                  >
                    {line.replace("## ", "")}
                  </h2>
                );
              }
              if (line.startsWith("### ")) {
                return (
                  <h3
                    key={key}
                    className="text-2xl font-semibold text-gray-900 mt-8 mb-3"
                  >
                    {line.replace("### ", "")}
                  </h3>
                );
              }
              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={key} className="font-bold text-gray-900 mt-6 mb-2">
                    {line.replaceAll("**", "")}
                  </p>
                );
              }
              if (line.startsWith("- ")) {
                return (
                  <li
                    key={key}
                    className="ml-6 text-gray-700 leading-relaxed mb-2"
                  >
                    {line.replace("- ", "")}
                  </li>
                );
              }
              if (line.trim() === "---") {
                return <hr key={key} className="my-8 border-gray-200" />;
              }
              if (line.trim() === "") {
                return <div key={key} className="h-4" />;
              }
              const withBold = line.replaceAll(
                /\*\*(.*?)\*\*/g,
                '<strong class="font-semibold text-gray-900">$1</strong>'
              );
              const withItalic = withBold.replaceAll(
                /\*(.*?)\*/g,
                '<em class="italic">$1</em>'
              );

              return (
                <p
                  key={key}
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
