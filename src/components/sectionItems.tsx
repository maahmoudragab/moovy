"use client";

import { useState, useEffect, useRef } from "react";
import { MediaItem } from "@/data/HandleRequests";
import Item from "./item";
import Spinner from "@/components/spinner";

type Props = {
  section: string;
  initialData: MediaItem[];
};

export default function MediaList({ section, initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current || !hasMore || loading) return;

    const target = observerRef.current;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          setLoading(true);

          try {
            const res = await fetch(`/api/section/${section}?page=${page + 1}`);
            const json = await res.json();

            if (json.length === 0) {
              setHasMore(false);
            } else {
              setData((prev) => {
                const merged = [...prev, ...json];
                const unique = Array.from(
                  new Map(merged.map((item) => [`${item.id}-${item.type}`, item])).values()
                );
                return unique;
              });
              setPage((p) => p + 1);
            }
          } catch (error) {
            console.error("Error fetching more:", error);
            setHasMore(false);
          } finally {
            setLoading(false);
          }
        }
      },
      {
        rootMargin: "100px",
        threshold: 0,
      }
    );

    observer.observe(target); // ✅ استخدمنا target مش observerRef.current

    return () => {
      observer.unobserve(target); // ✅ نفس الكلام هنا
    };
  }, [page, hasMore, loading, section]);

  return (
    <>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {data
          .filter((item) => item.poster_path)
          .map((item) => (
            <Item key={item.id} item={item} />
          ))}
      </div>

      <div ref={observerRef} className="h-12 mt-6 flex justify-center items-center">
        {loading && hasMore && <Spinner />}
        {!hasMore && !loading && (
          <p className="text-center text-zinc-400">انتهت النتائج</p>
        )}
      </div>
    </>
  );
}
