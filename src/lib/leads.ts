export const LEAD_TYPES = [
  "consult",
  "connect",
  "program",
  "event",
  "trust-buyer",
  "trust-supplier",
  "trust-expert",
  "partnership",
] as const;

export type LeadType = (typeof LEAD_TYPES)[number];

export type LeadPayload = {
  type: LeadType;
  name: string;
  company?: string;
  role?: string;
  phone: string;
  email: string;
  companySize?: string;
  need?: string;
  message?: string;
  program?: string;
  eventSlug?: string;
  consent: boolean;
  website?: string;
  elapsedMs?: number;
};

export type LeadResult =
  | { ok: true; id: string }
  | { ok: false; code: "VALIDATION" | "SPAM" | "NOT_CONFIGURED" | "UPSTREAM"; message: string };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[0-9+\s().-]{8,20}$/;

function isLeadType(value: unknown): value is LeadType {
  return typeof value === "string" && (LEAD_TYPES as readonly string[]).includes(value);
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function parseLead(input: unknown): { ok: true; payload: LeadPayload } | { ok: false; message: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, message: "Dữ liệu không hợp lệ." };
  }
  const raw = input as Record<string, unknown>;
  if (!isLeadType(raw.type)) {
    return { ok: false, message: "Loại yêu cầu không hợp lệ." };
  }

  const payload: LeadPayload = {
    type: raw.type,
    name: asTrimmedString(raw.name),
    company: typeof raw.company === "string" ? raw.company : undefined,
    role: typeof raw.role === "string" ? raw.role : undefined,
    phone: asTrimmedString(raw.phone),
    email: asTrimmedString(raw.email),
    companySize: typeof raw.companySize === "string" ? raw.companySize : undefined,
    need: typeof raw.need === "string" ? raw.need : undefined,
    message: typeof raw.message === "string" ? raw.message : undefined,
    program: typeof raw.program === "string" ? raw.program : undefined,
    eventSlug: typeof raw.eventSlug === "string" ? raw.eventSlug : undefined,
    consent: raw.consent === true,
    website: typeof raw.website === "string" ? raw.website : undefined,
    elapsedMs: typeof raw.elapsedMs === "number" ? raw.elapsedMs : undefined,
  };

  if (!payload.name.trim()) return { ok: false, message: "Vui lòng nhập họ tên." };
  if (!payload.phone.trim() || !phoneRe.test(payload.phone)) {
    return { ok: false, message: "Số điện thoại chưa hợp lệ." };
  }
  if (!payload.email.trim() || !emailRe.test(payload.email)) {
    return { ok: false, message: "Email chưa hợp lệ." };
  }
  if (!payload.consent) {
    return { ok: false, message: "Vui lòng đồng ý với chính sách bảo mật trước khi gửi." };
  }
  return { ok: true, payload };
}

export function validateLead(payload: unknown): string | null {
  const parsed = parseLead(payload);
  return parsed.ok ? null : parsed.message;
}

export function isLikelySpam(payload: LeadPayload) {
  if (payload.website && payload.website.trim().length > 0) return true;
  if (payload.elapsedMs !== undefined && payload.elapsedMs < 1200) return true;
  return false;
}

export function buildLeadWebhookBody(payload: LeadPayload) {
  const safe = { ...payload };
  delete safe.website;
  return { ...safe, source: "vabix.edu.vn" as const };
}

/**
 * Persist to the platform inquiry table first. Optional webhook is extra delivery, not the source of truth.
 */
export async function submitLead(input: unknown, sourcePath = ""): Promise<LeadResult> {
  const parsed = parseLead(input);
  if (!parsed.ok) return { ok: false, code: "VALIDATION", message: parsed.message };
  const payload = parsed.payload;
  if (isLikelySpam(payload)) {
    return { ok: false, code: "SPAM", message: "Yêu cầu không thể xử lý. Vui lòng thử lại hoặc gọi hotline." };
  }

  try {
    const { bootPlatform } = await import("@/platform/boot");
    const { saveInquiryFromLead } = await import("@/platform/inquiries/service");
    await bootPlatform();
    const saved = saveInquiryFromLead(payload, sourcePath);
    const endpoint = process.env.LEAD_WEBHOOK_URL;
    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...buildLeadWebhookBody(payload), inquiryId: saved.id }),
        });
      } catch {
        // Inquiry already stored; webhook is optional.
      }
    }
    return { ok: true, id: saved.id };
  } catch {
    return { ok: false, code: "UPSTREAM", message: "Không ghi nhận được yêu cầu lúc này. Vui lòng thử lại hoặc gọi hotline." };
  }
}
