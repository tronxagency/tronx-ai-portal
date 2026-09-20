import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "tronx_session";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/gmail",
  "/reviews",
  "/clients",
  "/settings",
  "/api/emails",
  "/api/reviews",
  "/api/clients",
];

function b64url(bytes: ArrayBuffer | Uint8Array | string): string {
  let u8: Uint8Array;
  if (typeof bytes === "string") {
    u8 = new TextEncoder().encode(bytes);
  } else if (bytes instanceof Uint8Array) {
    u8 = bytes;
  } else {
    u8 = new Uint8Array(bytes);
  }
  let str = "";
  for (let i = 0; i < u8.length; i++) str += String.fromCharCode(u8[i]!);
  return btoa(str).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromB64url(input: string): Uint8Array {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacSign(payloadB64: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64)
  );
  return b64url(sig);
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return false;
    const expected = await hmacSign(payloadB64, secret);
    if (!timingSafeEqualStr(sig, expected)) return false;
    const json = new TextDecoder().decode(fromB64url(payloadB64));
    const payload = JSON.parse(json) as { exp?: number };
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (!needsAuth) return NextResponse.next();

  const secret = process.env.SESSION_SECRET || "";
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const valid = Boolean(secret && token && (await verifyToken(token, secret)));

  if (!valid) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/gmail/:path*",
    "/reviews/:path*",
    "/clients/:path*",
    "/settings/:path*",
    "/api/emails/:path*",
    "/api/reviews/:path*",
    "/api/clients/:path*",
  ],
};
