// Lightweight parser for extracting memory annotations from LLM output.
export function parseMemories(output: string) {
  const memoryRegex = /\[MEMORY:\s*(.*?)\s*\|\s*(.*?)\]/g;
  let memoryMatch;
  const results: Array<{ content: string; tags: string[] }> = [];

  while ((memoryMatch = memoryRegex.exec(output)) !== null) {
    const memoryContent = memoryMatch[1].trim();
    const tagsText = memoryMatch[2].trim();
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 3);

    results.push({ content: memoryContent, tags });
  }

  return results;
}

export default parseMemories;
