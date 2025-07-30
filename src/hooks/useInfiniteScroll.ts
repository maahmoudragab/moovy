"use client"
import { useEffect, useRef, useState } from "react" // أضف useCallback هنا
import type { DependencyList } from "react" // استورد DependencyList للنوع

export function useInfiniteScroll<T extends { id: string | number }>(
  /**
   * A function that builds the fetch URL for a given page.
   * IMPORTANT: This function should be memoized using `useCallback` in the consuming component
   * to prevent infinite re-renders.
   */
  fetchUrlBuilder: (page: number) => string,
  deps: DependencyList = [], // استخدم DependencyList لتحسين النوع
) {
  const [items, setItems] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<HTMLDivElement | null>(null)

  // Reset state when dependencies change
  useEffect(() => {
    setItems([])
    setPage(1)
    setHasMore(true)
  }, deps)

  // Fetch data when page or fetchUrlBuilder changes
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(fetchUrlBuilder(page))
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data: T[] = await res.json()

        if (data.length === 0) {
          setHasMore(false)
        } else {
          setItems((prev) => {
            // Filter out duplicates based on a unique 'id' property
            const newUniqueItems = data.filter(
              (newItem) => !prev.some((existingItem) => existingItem.id === newItem.id),
            )
            return [...prev, ...newUniqueItems]
          })
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        // يمكنك إضافة معالجة للأخطاء هنا، مثل تعيين hasMore(false) أو عرض رسالة خطأ
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [page, fetchUrlBuilder, ...deps]) // fetchUrlBuilder هنا هو السبب المحتمل للحلقة اللانهائية

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    if (!observerRef.current || !hasMore || loading) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 1 },
    )

    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading])

  console.log("iteeeeems", items)
  return { items, observerRef, loading }
}
