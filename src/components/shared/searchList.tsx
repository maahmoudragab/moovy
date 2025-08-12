"use client"

// React
import { useCallback } from "react";

// Hooks
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

// App Components
import MediaCard from "@/components/shared/mediaCard";

// Types
import type { MediaItem } from "@/data/HandleRequests";
import Loaders from "../loaders/loaders";


export default function SearchList({ query }: { query: string }) {
  const fetchUrlBuilder = useCallback((page: number) => `/api/search?query=${query}&page=${page}`, [query])

  const { items, observerRef, loading } = useInfiniteScroll<MediaItem>(fetchUrlBuilder, [query])

  return (
    <>
      {loading && !items.length && <Loaders />}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 md:gap-3">
        {items
          .filter(i => i.poster_path)
          .map(item => <MediaCard key={item.id} item={item} section />)}
        <div ref={observerRef} className="h-10" />
        {loading && items.length > 0 && <Loaders />}
      </div>
      {!loading && <p className="text-white p-y-2 text-center">لا توجد بيانات لعرضها.</p>}
    </>
  )
}
