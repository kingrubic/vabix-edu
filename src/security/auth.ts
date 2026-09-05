import bcrypt from "bcryptjs";

export { SESSION_COOKIE, SESSION_TTL_SECONDS, signSession, verifySession, cookieOptions } from "./jwt";
export type { SessionClaims } from "./jwt";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
