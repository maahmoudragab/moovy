"use client";
// React & Next
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Types
import { MediaItem } from "@/data/HandleRequests";

export default function MediaCard({
  item,
  title,
  section = false,
}: {
  item: MediaItem;
  title?: string;
  section?: boolean;
}) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    }
  }, []);

  const isNew = item.release_date
    ? (Date.now() - new Date(item.release_date).getTime()) / 86400000 <= 30
    : false;

  return (
    <div
      dir="rtl"
      onClick={() =>
        router.push(`/details/${item.type == "فيلم" ? "movie" : "tv"}/${item.id}`)
      }
      className={`cursor-pointer group relative aspect-[2/3] ${section ? "w-full" : "w-[130px] md:w-[150px] lg:w-[170px]"
        } flex-shrink-0 rounded-xl overflow-hidden transition-all duration-500`}
    >
      <Image
        src={`https://image.tmdb.org/t/p/w780${item.poster_path}`}
        alt={item.title_ar || ""}
        fill
        unoptimized
        className="object-cover"
      />

      {!isMobile && (
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent text-white px-3 py-2 z-20 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 space-y-1">
          <h3 className="font-bold text-sm md:text-base truncate">{item.title_ar}</h3>
          <div className="flex items-center justify-between text-xs opacity-85">
            {item.genre_ids && (
              <p className="text-[10px] opacity-70 truncate w-[70%]">
                {item.genre_ids.join("، ")}
              </p>
            )}
            <span>{item.release_date?.slice(0, 4)}</span>
          </div>
        </div>
      )}

      {isNew && title !== "الأعمال القادمة" && (
        <div className="absolute top-1 left-1 z-30 bg-gradient-to-r from-red-600 to-red-400 text-white text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full shadow-md">
          New
        </div>
      )}

      <span className="absolute top-1 right-1 z-30 bg-black/80 text-yellow-400 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
        <span className="text-inherit">⭐</span>
        {item.vote_average?.toFixed(1)}
      </span>
    </div>
  );
}
