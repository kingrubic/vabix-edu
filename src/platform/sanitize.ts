const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "a",
  "span",
  "div",
]);

export function sanitizeHtml(input: string) {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (full, tag: string, attrs: string) => {
      const name = tag.toLowerCase();
      if (!ALLOWED_TAGS.has(name)) return "";
      if (name === "a") {
        const href = attrs.match(/href\s*=\s*("([^"]*)"|'([^']*)')/i);
        const url = href?.[2] ?? href?.[3] ?? "";
        if (!url || url.startsWith("javascript:")) return `<${name}>`;
        return `<a href="${url.replace(/"/g, "")}" rel="noopener noreferrer">`;
      }
      return full.startsWith("</") ? `</${name}>` : `<${name}>`;
    });
}

export function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
