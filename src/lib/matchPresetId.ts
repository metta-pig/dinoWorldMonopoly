/** Match user text to a preset id from manifest entries. */
export function matchPresetId<T extends string>(
  input: string,
  entries: readonly { id: T; promptHints: readonly string[] }[],
): T | null {
  const t = input.trim().toLowerCase();
  if (!t) {
    return null;
  }
  const exact = entries.find((e) => e.id === t);
  if (exact) {
    return exact.id;
  }
  for (const entry of entries) {
    if (entry.promptHints.some((hint) => t.includes(hint.toLowerCase()))) {
      return entry.id;
    }
  }
  return null;
}
