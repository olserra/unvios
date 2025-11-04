"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function MiniPlayground() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function run() {
    setLoading(true);
    setResult(null);
    // simulate a quick RAG/embedding lookup
    setTimeout(() => {
      setResult(
        `Mock result for "${
          query || "where did I put the notes"
        }": Found in "Q4 pricing notes" — highlights: discounts, timeline, and owner.`
      );
      setLoading(false);
    }, 700);
  }

  return (
    <div className="mt-4">
      <label htmlFor="mp-query" className="text-sm font-medium text-gray-700">
        Try a quick query
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="mp-query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Where are the pricing notes?"
          className="flex-1 rounded-md border border-gray-200 p-3 bg-white text-sm"
        />
        <button
          onClick={run}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-orange-600 text-white disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Run"}
        </button>
      </div>

      <div className="mt-4">
        <div className="text-xs text-gray-500">Result</div>
        <div className="mt-2 rounded-lg bg-gray-900 text-gray-100 p-3 text-sm min-h-[56px]">
          {loading ? "Running..." : result ?? "No query run yet."}
        </div>
      </div>
    </div>
  );
}
