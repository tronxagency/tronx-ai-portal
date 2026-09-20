import { getEmails } from "@/lib/store";
import { GmailClient } from "./GmailClient";

export default async function GmailPage() {
  const emails = await getEmails();
  const sorted = [...emails].sort(
    (a, b) =>
      new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );
  return <GmailClient initial={sorted} />;
}
