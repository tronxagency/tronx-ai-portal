import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import type { SessionPayload } from "./types";

const COOKIE_NAME = "tronx_session";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return secret;
}

function getMaxAge(): number {
  const raw = process.env.SESSION_MAX_AGE;
  if (raw && !Number.isNaN(Number(raw))) return Number(raw);
  return 60 * 60 * 24 * 7; // 7 days
}

function b64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function fromB64url(input: string): Buffer {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64");
}

function sign(payloadB64: string): string {
  return b64url(
    createHmac("sha256", getSecret()).update(payloadB64).digest()
  );
}

export function createSessionToken(email: string, name = "TronX Operator"): string {
  const maxAge = getMaxAge();
  const payload: SessionPayload = {
    email,
    name,
    exp: Math.floor(Date.now() / 1000) + maxAge,
  };
  const payloadB64 = b64url(JSON.stringify(payload));
  return `${payloadB64}.${sign(payloadB64)}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return null;
    const expected = sign(payloadB64);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(fromB64url(payloadB64).toString("utf8")) as SessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getMaxAge(),
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function validateDemoCredentials(email: string, password: string): boolean {
  const expectedPassword = process.env.DEMO_PASSWORD || "tronx-demo-2026";
  const normalized = email.trim().toLowerCase();
  const allowedDomain = normalized.endsWith("@tronx.agency");
  const exactDemo =
    normalized === (process.env.DEMO_EMAIL || "any@tronx.agency").toLowerCase();
  if (!allowedDomain && !exactDemo) return false;

  const a = Buffer.from(password);
  const b = Buffer.from(expectedPassword);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export { COOKIE_NAME };
