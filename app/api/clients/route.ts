import { NextResponse } from "next/server";
import { createClient, getClients } from "@/lib/store";

export async function GET() {
  const clients = await getClients();
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    industry?: string;
    contactEmail?: string;
    contactName?: string;
    status?: "active" | "onboarding" | "paused";
    services?: string[];
    notes?: string;
  };

  if (!body.name || !body.contactEmail) {
    return NextResponse.json(
      { error: "name and contactEmail are required" },
      { status: 400 }
    );
  }

  const client = await createClient({
    name: body.name,
    industry: body.industry || "General",
    contactEmail: body.contactEmail,
    contactName: body.contactName || "",
    status: body.status || "onboarding",
    services: body.services || [],
    notes: body.notes,
  });

  return NextResponse.json(client, { status: 201 });
}
