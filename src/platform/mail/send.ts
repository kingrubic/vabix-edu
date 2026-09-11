export type MailResult =
  | { ok: true; id: string }
  | { ok: false; code: "NOT_CONFIGURED" | "UPSTREAM"; message: string };

export function mailConfigured() {
  return Boolean(process.env.SMTP_URL || process.env.EMAIL_WEBHOOK_URL);
}

export async function sendPlatformMail(input: {
  to: string;
  subject: string;
  text: string;
}): Promise<MailResult> {
  const webhook = process.env.EMAIL_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: input.to, subject: input.subject, text: input.text, source: "vabix-platform" }),
      });
      if (!res.ok) {
        return { ok: false, code: "UPSTREAM", message: "Không gửi được email lúc này." };
      }
      return { ok: true, id: crypto.randomUUID() };
    } catch {
      return { ok: false, code: "UPSTREAM", message: "Không kết nối được dịch vụ email." };
    }
  }
  if (process.env.SMTP_URL) {
    return {
      ok: false,
      code: "NOT_CONFIGURED",
      message: "SMTP_URL đã được đặt nhưng trình gửi SMTP chưa được kết nối trong môi trường này.",
    };
  }
  return {
    ok: false,
    code: "NOT_CONFIGURED",
    message: "Chưa cấu hình EMAIL_WEBHOOK_URL hoặc SMTP_URL nên hệ thống không gửi được email.",
  };
}
