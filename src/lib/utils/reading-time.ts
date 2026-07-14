const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(content: string): number {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return 1;
  }

  const words = normalized.split(" ").length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
