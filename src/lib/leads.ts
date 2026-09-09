export type LeadType =
  | "consult"
  | "connect"
  | "program"
  | "event"
  | "trust-buyer"
  | "trust-supplier"
  | "trust-expert"
  | "partnership";

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

export function validateLead(payload: LeadPayload): string | null {
  if (!payload.name?.trim()) return "Vui lòng nhập họ tên.";
  if (!payload.phone?.trim() || !phoneRe.test(payload.phone)) return "Số điện thoại chưa hợp lệ.";
  if (!payload.email?.trim() || !emailRe.test(payload.email)) return "Email chưa hợp lệ.";
  if (!payload.consent) return "Vui lòng đồng ý với chính sách bảo mật trước khi gửi.";
  return null;
}

export function isLikelySpam(payload: LeadPayload) {
  if (payload.website && payload.website.trim().length > 0) return true;
  if (payload.elapsedMs !== undefined && payload.elapsedMs < 1200) return true;
  return false;
}

/**
 * Lead adapter. When LEAD_WEBHOOK_URL is set, posts JSON to that endpoint.
 * When not configured, returns NOT_CONFIGURED so the UI never fakes success.
 */
export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const error = validateLead(payload);
  if (error) return { ok: false, code: "VALIDATION", message: error };
  if (isLikelySpam(payload)) {
    return { ok: false, code: "SPAM", message: "Yêu cầu không thể xử lý. Vui lòng thử lại hoặc gọi hotline." };
  }

  const endpoint = process.env.LEAD_WEBHOOK_URL;
  if (!endpoint) {
    return {
      ok: false,
      code: "NOT_CONFIGURED",
      message:
        "Hệ thống tiếp nhận chưa được kết nối. Vui lòng gọi hotline hoặc gửi email trực tiếp — thông tin liên hệ nằm cuối trang.",
    };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, website: undefined, source: "vabix.edu.vn" }),
    });
    if (!res.ok) {
      return { ok: false, code: "UPSTREAM", message: "Không gửi được yêu cầu lúc này. Vui lòng thử lại hoặc gọi hotline." };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id ?? crypto.randomUUID() };
  } catch {
    return { ok: false, code: "UPSTREAM", message: "Không kết nối được máy chủ. Vui lòng thử lại sau." };
  }
}
