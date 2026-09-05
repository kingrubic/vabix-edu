import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "vabix_bizcar_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 12;

export type SessionClaims = {
  sub: string;
  email: string;
  name: string;
  jti: string;
};

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (secret) return new TextEncoder().encode(secret);
  if (process.env.NODE_ENV !== "production") {
    return new TextEncoder().encode("vabix-bizcar-dev-secret-not-for-production");
  }
  throw new Error("AUTH_SECRET is required in production");
}

export async function signSession(input: Omit<SessionClaims, "jti"> & { jti?: string }): Promise<{
  token: string;
  jti: string;
}> {
  const jti = input.jti ?? crypto.randomUUID();
  const token = await new SignJWT({ email: input.email, name: input.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(input.sub)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
  return { token, jti };
}

export async function verifySession(token: string): Promise<SessionClaims | null> {
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

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}
