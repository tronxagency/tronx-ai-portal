export type Priority = "critical" | "high" | "medium" | "low";

export type EmailStatus = "open" | "drafted" | "handled";

export interface Email {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  preview: string;
  body: string;
  receivedAt: string;
  priority: Priority;
  labels: string[];
  status: EmailStatus;
  draftReply?: string;
  client?: string;
}

export type ReviewStatus = "needs_reply" | "draft" | "approved" | "posted";

export interface Review {
  id: string;
  client: string;
  platform: "Google" | "GMB";
  reviewer: string;
  rating: number;
  text: string | null;
  reviewedAt: string;
  status: ReviewStatus;
  draftReply?: string;
  postedReply?: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  contactEmail: string;
  contactName: string;
  status: "active" | "onboarding" | "paused";
  services: string[];
  notes?: string;
  createdAt: string;
}

export interface SessionPayload {
  email: string;
  name: string;
  exp: number;
}
