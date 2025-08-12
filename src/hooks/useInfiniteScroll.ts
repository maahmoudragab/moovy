"use client"
import { useEffect, useRef, useState } from "react"
import type { DependencyList } from "react"

export function useInfiniteScroll<T extends { id: string | number }>(
  /**
   * A function that builds the fetch URL for a given page.
   * IMPORTANT: This function should be memoized using `useCallback` in the consuming component
   * to prevent infinite re-renders.
   */
  fetchUrlBuilder: (page: number) => string,
  deps: DependencyList = []
) {
  const [items, setItems] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
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
    setLoading(true)

    const load = async () => {
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
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [page, fetchUrlBuilder, ...deps])

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

  return { items, observerRef, loading }
}
