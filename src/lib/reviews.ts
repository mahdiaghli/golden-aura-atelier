import { recordAdminEvent } from "./admin-events";

export type ProductReview = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  createdAt: string;
  verified?: boolean;
};

const REVIEWS_KEY = "aurum-product-reviews-v1";

function readReviews(): ProductReview[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(REVIEWS_KEY);
    return raw ? (JSON.parse(raw) as ProductReview[]) : [];
  } catch {
    return [];
  }
}

function writeReviews(reviews: ProductReview[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  window.dispatchEvent(new CustomEvent(`${REVIEWS_KEY}:changed`));
}

export function listReviews(productId?: string): ProductReview[] {
  const reviews = readReviews();
  return productId ? reviews.filter((review) => review.productId === productId) : reviews;
}

export function createReview(input: {
  productId: string;
  productName: string;
  name: string;
  rating: number;
  text: string;
  verified?: boolean;
}): ProductReview {
  const review: ProductReview = {
    id: `rev-${Date.now().toString(36)}`,
    productId: input.productId,
    name: input.name.trim(),
    rating: input.rating,
    text: input.text.trim(),
    date: new Date().toLocaleDateString("fa-IR"),
    createdAt: new Date().toISOString(),
    verified: input.verified ?? false,
  };

  writeReviews([review, ...readReviews()]);
  recordAdminEvent({
    type: "review_submitted",
    title: "بررسی جدید ثبت شد",
    entityType: "review",
    entityId: review.id,
    details: {
      productId: input.productId,
      productName: input.productName,
      reviewer: review.name,
      rating: review.rating,
    },
  });
  return review;
}

export function getReviewSummary(productId: string) {
  const reviews = listReviews(productId);
  const count = reviews.length;
  const averageRating = count
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / count
    : 0;

  return { reviews, count, averageRating };
}
