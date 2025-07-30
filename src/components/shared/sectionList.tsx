"use client"
// React
import { useCallback } from "react";

// Hooks
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

// App Components
import MediaCard from "@/components/shared/mediaCard";

// Types
import type { MediaItem } from "@/data/HandleRequests";

export default function SectionList({ section }: { section: string }) {
  const fetchUrlBuilder = useCallback((page: number) => `/api/section?type=${section}&page=${page}`, [section])

  const { items, observerRef, loading } = useInfiniteScroll<MediaItem>(fetchUrlBuilder, [section])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 md:gap-4">
      {items
        .filter((i) => i.poster_path)
        .map((item) => (
          // استخدم item.id كمفتاح فريد بدلاً من الفهرس
          <MediaCard key={item.id} item={item} section={true} />
        ))}
      <div ref={observerRef} className="h-10" />
      {loading && <p className="text-white">جاري التحميل...</p>}
      {/* يمكنك إضافة رسالة "لا توجد المزيد من البيانات" هنا إذا لم يكن هناك تحميل وitems فارغة */}
      {!loading && items.length === 0 && <p className="text-white">لا توجد بيانات لعرضها.</p>}
    </div>
  )
}
