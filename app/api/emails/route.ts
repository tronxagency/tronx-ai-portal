import { NextResponse } from "next/server";
import { getEmails } from "@/lib/store";

export async function GET() {
  const emails = await getEmails();
  const sorted = [...emails].sort(
    (a, b) =>
      new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );
  return NextResponse.json(sorted);
}
