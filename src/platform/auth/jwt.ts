import { SignJWT, jwtVerify } from "jose";

export const PLATFORM_SESSION_COOKIE = "vabix_platform_session";
export const PLATFORM_SESSION_TTL = 60 * 60 * 12;

export type PlatformClaims = {
  sub: string;
  email: string;
  name: string;
  jti: string;
};

function secretKey() {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (secret) return new TextEncoder().encode(secret);
  if (process.env.NODE_ENV !== "production") {
    return new TextEncoder().encode("vabix-platform-dev-secret-not-for-production");
  }
  throw new Error("AUTH_SECRET is required in production");
}

export function platformCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PLATFORM_SESSION_TTL,
  };
}

export async function signPlatformSession(input: Omit<PlatformClaims, "jti"> & { jti?: string }) {
  const jti = input.jti ?? crypto.randomUUID();
  const token = await new SignJWT({ email: input.email, name: input.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(input.sub)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(`${PLATFORM_SESSION_TTL}s`)
    .sign(secretKey());
  return { token, jti };
}

export async function verifyPlatformSession(token: string): Promise<PlatformClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub || !payload.jti || typeof payload.email !== "string") return null;
    return {
      sub: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "",
      jti: payload.jti,
    };
  } catch {
    return null;
  }
}

export const PLATFORM_PUBLIC_PREFIXES = [
  "/dang-nhap",
  "/quen-mat-khau",
  "/dat-lai-mat-khau",
  "/thiet-lap",
  "/chung-nhan/",
];

export const PLATFORM_PROTECTED_PREFIXES = ["/admin", "/hoc-tap", "/giang-day", "/lam-viec", "/tai-khoan"];

export function isPlatformPublicPath(pathname: string) {
  return PLATFORM_PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}`));
}

export function isPlatformProtectedPath(pathname: string) {
  return PLATFORM_PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
