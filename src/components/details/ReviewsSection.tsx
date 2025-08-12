"use client";
import Image from "next/image";
import PaginatedSection from "@/components/shared/paginatedSection";
import { FullDetailsType } from "@/data/single_requests/fetch_details";
import { useState } from "react";

export default function ReviewsSection({ 
  reviews, 
  isMobile 
}: { 
  reviews: FullDetailsType["reviews"];
  isMobile: boolean;
}) {
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const reviewsPerPage = isMobile ? 2 : 4;
  const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage);
  const visibleReviews = reviews.slice((currentReviewPage - 1) * reviewsPerPage, currentReviewPage * reviewsPerPage);

  if (reviews.length === 0) return null;

  return (
    <PaginatedSection
      title="ريفيوهات المشاهدين"
      totalPages={totalReviewPages}
      currentPage={currentReviewPage}
      setCurrentPage={setCurrentReviewPage}
    >
      {visibleReviews.map((review, index) => (
        <div key={index} className="rounded-lg overflow-hidden lg:border-l-4 border border-white/10 bg-white/5 p-4 space-y-2 text-white">
          <div className="flex items-center gap-3">
            {review.author_details.avatar_path && (
              <Image
                src={review.author_details.avatar_path}
                alt={review.author}
                unoptimized
                width={50}
                height={50}
                className="rounded-full w-10 h-10 object-cover"
              />
            )}
            <div>
              <p className="text-sm font-semibold text-white/80 truncate">{review.author}</p>
              <p className="text-xs text-white/65 truncate">{review.created_at_formatted}</p>
            </div>
          </div>
          <p className="text-sm text-white/80 line-clamp-3">{review.content}</p>
        </div>
      ))}
    </PaginatedSection>
  );
}