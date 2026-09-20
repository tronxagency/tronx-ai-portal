import { NextResponse } from "next/server";
import { getReviews } from "@/lib/store";

export async function GET() {
  const reviews = await getReviews();
  const sorted = [...reviews].sort(
    (a, b) =>
      new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime()
  );
  return NextResponse.json(sorted);
}
