"use client"

// React
import { useCallback } from "react";

// Hooks
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

// App Components
import MediaCard from "@/components/shared/mediaCard";

// Types
import type { MediaItem } from "@/data/HandleRequests";


export default function SearchList({ query }: { query: string }) {
  const fetchUrlBuilder = useCallback((page: number) => `/api/search?query=${query}&page=${page}`, [query])

  const { items, observerRef, loading } = useInfiniteScroll<MediaItem>(fetchUrlBuilder, [query])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-3">
      {items
        .filter((i) => i.poster_path && i.backdrop_path)
        .map((item) => (
          <MediaCard key={item.id} item={item} section={true} />
        ))}
      <div ref={observerRef} className="h-10" />
      {loading && <p className="text-white">جاري التحميل...</p>}
      {/* أضف رسالة "لا توجد بيانات" عندما لا يكون هناك تحميل ولا توجد عناصر */}
      {!loading && items.length === 0 && <p className="text-white">لا توجد نتائج لبحثك.</p>}
    </div>
  )
}
