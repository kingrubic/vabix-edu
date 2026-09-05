import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession, type SessionClaims } from "./auth";
import { accessContext, findUserById, isJtiRevoked } from "@/db/repo";
import type { AccessContext } from "./rbac";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  isDemo: boolean;
  claims: SessionClaims;
  access: AccessContext;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const claims = await verifySession(token);
  if (!claims) return null;
  if (await isJtiRevoked(claims.jti)) return null;
  const user = await findUserById(claims.sub);
  if (!user || !user.isActive) return null;
  const access = await accessContext(user.id);
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isDemo: user.isDemo,
    claims,
    access,
  };
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}
