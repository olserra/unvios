"use server";

import { db } from "@/lib/db/drizzle";
import { getUser } from "@/lib/db/queries";
import { memories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Fetch user profile (omit sensitive fields)
  const profile = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };

  // Fetch user's memories
  const rows = await db
    .select()
    .from(memories)
    .where(eq(memories.userId, user.id));

  // Sanitize memories: remove embedding/vector fields if present and parse tags
  const sanitizedMemories = (rows as any[]).map((r) => {
    const mem: any = {
      id: r.id,
      content: r.content,
      category: r.category,
      createdAt: r.createdAt,
    };

    // Parse tags stored as JSON string
    try {
      mem.tags = r.tags ? JSON.parse(r.tags as string) : [];
    } catch (error_) {
      // If parsing fails, fallback to an empty tag list and log the error.
      // eslint-disable-next-line no-console
      console.warn("export: failed to parse tags for memory", r.id, error_);
      mem.tags = [];
    }

    // Explicitly skip any known embedding/vector fields if present
    // (some deployments may have added embedding columns)
    // Do not include r.embedding, r.embedding_vector, or similar fields.

    return mem;
  });

  const exportData = {
    profile,
    memories: sanitizedMemories,
  };

  const blob = JSON.stringify(exportData, null, 2);

  return new NextResponse(blob, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="unvios-export-${user.id}.json"`,
    },
  });
}
