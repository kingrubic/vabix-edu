/**
 * Detect CMS rows that were seeded from `src/content/*` (origin `file-seed`)
 * but whose source entry has since been removed from the content files.
 *
 * `seedCmsFromFiles()` only inserts/updates rows for entries that still exist
 * in the files; it never deletes. Without this guard, a removed entry would
 * keep rendering from its leftover published CMS row (as a "CMS-only" record)
 * until someone deletes the row by hand. Rows created in the CMS (origin
 * `cms`) are never treated as orphans.
 */
export type FileSeedSource = {
  slugs: ReadonlySet<string>;
  ids: ReadonlySet<string>;
};

export type OrphanCandidate = {
  slug: string;
  origin?: string | null;
  payload?: string | null;
};

export function fileSeedSourceFrom(items: readonly { slug: string; id?: string }[]): FileSeedSource {
  return {
    slugs: new Set(items.map((item) => item.slug)),
    ids: new Set(items.map((item) => item.id).filter((id): id is string => typeof id === "string" && id.length > 0)),
  };
}

function payloadId(payload?: string | null): string | null {
  if (!payload) return null;
  try {
    const parsed = JSON.parse(payload) as { id?: unknown };
    return typeof parsed?.id === "string" && parsed.id ? parsed.id : null;
  } catch {
    return null;
  }
}

/**
 * True when the row came from the file seed and neither its slug nor its
 * original content id exists in the current content files. Matching on the
 * payload id as well keeps a seeded row whose slug an editor renamed in the
 * CMS from being hidden.
 */
export function isOrphanedFileSeed(doc: OrphanCandidate, source: FileSeedSource | null | undefined): boolean {
  if (!source) return false;
  if (doc.origin !== "file-seed") return false;
  if (source.slugs.has(doc.slug)) return false;
  const id = payloadId(doc.payload);
  if (id && source.ids.has(id)) return false;
  return true;
}
