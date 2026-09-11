import { api, getConvexHttpClient } from "@/lib/convexServer";

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
 * Lead adapter. Prefers Convex local/cloud when NEXT_PUBLIC_CONVEX_URL is set.
 * Optionally also posts to LEAD_WEBHOOK_URL. If neither is configured, returns NOT_CONFIGURED.
 */
export async function submitLead(input: unknown): Promise<LeadResult> {
  const parsed = parseLead(input);
  if (!parsed.ok) return { ok: false, code: "VALIDATION", message: parsed.message };
  const payload = parsed.payload;
  if (isLikelySpam(payload)) {
    return { ok: false, code: "SPAM", message: "Yêu cầu không thể xử lý. Vui lòng thử lại hoặc gọi hotline." };
  }

  const body = buildLeadWebhookBody(payload);
  const convexId = await saveLeadToConvex(body);
  const endpoint = process.env.LEAD_WEBHOOK_URL;

  if (!convexId && !endpoint) {
    return {
      ok: false,
      code: "NOT_CONFIGURED",
      message:
        "Hệ thống tiếp nhận chưa được kết nối. Vui lòng gọi hotline hoặc gửi email trực tiếp — thông tin liên hệ nằm cuối trang.",
    };
  }

  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok && !convexId) {
        return { ok: false, code: "UPSTREAM", message: "Không gửi được yêu cầu lúc này. Vui lòng thử lại hoặc gọi hotline." };
      }
    } catch {
      if (!convexId) {
        return { ok: false, code: "UPSTREAM", message: "Không kết nối được máy chủ. Vui lòng thử lại sau." };
      }
    }
  }

  return { ok: true, id: convexId ?? crypto.randomUUID() };
}

async function saveLeadToConvex(body: ReturnType<typeof buildLeadWebhookBody>): Promise<string | null> {
  const client = getConvexHttpClient();
  if (!client) return null;
  try {
    const id = await client.mutation(api.leads.submit, {
      type: body.type,
      name: body.name,
      company: body.company,
      role: body.role,
      phone: body.phone,
      email: body.email,
      companySize: body.companySize,
      need: body.need,
      message: body.message,
      program: body.program,
      eventSlug: body.eventSlug,
      source: body.source,
    });
    return String(id);
  } catch {
    return null;
  }
}
