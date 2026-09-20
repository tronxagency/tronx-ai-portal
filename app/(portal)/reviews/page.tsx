import { getReviews } from "@/lib/store";
import { ReviewsClient } from "./ReviewsClient";

export default async function ReviewsPage() {
  const reviews = await getReviews();
  const sorted = [...reviews].sort(
    (a, b) =>
      new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime()
  );
  return <ReviewsClient initial={sorted} />;
}
