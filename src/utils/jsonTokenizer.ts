import type { JsonToken, JsonTokenKind } from "../types";

export function tokenizeJson(source: string): JsonToken[] {
  const tokens: JsonToken[] = [];

  // Order matters: keys must be matched before generic strings.
  const re =
    /"(?:\\.|[^"\\])*"(?=\s*:)|"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\btrue\b|\bfalse\b|\bnull\b|[{}[\],:]/g;

  let lastIndex = 0;
  for (const match of source.matchAll(re)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      tokens.push({ kind: "text", text: source.slice(lastIndex, index) });
    }

    const text = match[0];
    let kind: JsonTokenKind = "text";
    if (text === "true" || text === "false") kind = "boolean";
    else if (text === "null") kind = "null";
    else if (text.length === 1 && "{}[],:".includes(text)) kind = "punctuation";
    else if (text.startsWith('"')) {
      const nextChar = source.slice(index + text.length).trimStart()[0];
      kind = nextChar === ":" ? "key" : "string";
    } else kind = "number";

    tokens.push({ kind, text });
    lastIndex = index + text.length;
  }

  if (lastIndex < source.length) {
    tokens.push({ kind: "text", text: source.slice(lastIndex) });
  }

  return tokens;
}

export function getTokenColorClass(kind: JsonTokenKind): string {
  switch (kind) {
    case "key":
      return "text-sky-700 font-semibold";
    case "string":
      return "text-emerald-700";
    case "number":
      return "text-amber-700";
    case "boolean":
    case "null":
      return "text-violet-700";
    case "punctuation":
      return "text-slate-400";
    default:
      return "text-slate-900";
  }
}
