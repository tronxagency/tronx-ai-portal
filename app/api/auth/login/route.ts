import { NextResponse } from "next/server";
import {
  createSessionToken,
  setSessionCookie,
  validateDemoCredentials,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = (body.email || "").trim();
    const password = body.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!validateDemoCredentials(email, password)) {
      return NextResponse.json(
        { error: "Invalid credentials. Use any@tronx.agency with the demo password." },
        { status: 401 }
      );
    }

    const token = createSessionToken(email);
    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      email,
      name: "TronX Operator",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
