/**
 * Experts are seeded with the CMS document title ("Tiêu đề") = the expert's display name,
 * while `payload.title` holds the job title / short description shown on cards and detail pages.
 * The generic public payload overwrites `title` with the document title, so without this mapping
 * every card printed the name twice instead of the description.
 */
export function mapExpertCmsPayload(
  documentTitle: string,
  rawPayload: Record<string, unknown>,
  publicPayload: Record<string, unknown>,
): Record<string, unknown> {
  return {
    ...publicPayload,
    name: documentTitle || publicPayload.name,
    title: typeof rawPayload.title === "string" ? rawPayload.title : undefined,
  };
}
