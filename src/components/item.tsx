"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { MediaItem } from "@/data/HandleRequests";

export default function Item({ item }: { item: MediaItem }) {
  const router = useRouter();

  if (!item.poster_path) return null;

  const isNew = item.release_date
    ? (Date.now() - new Date(item.release_date).getTime()) / 86400000 <= 30
    : false;

  return (
    <div
      onClick={() =>
        router.push(`/details/${item.type === "فيلم" ? "movie" : "tv"}/${item.id}`)
      }
      className="cursor-pointer relative w-full aspect-[2/3] rounded-xl overflow-hidden transition-all duration-500"
    >
      <Image
        src={`https://image.tmdb.org/t/p/w780${item.poster_path}`}
        alt={item.title_ar || item.title_en || "poster"}
        fill
        className="object-cover"
      />

      {/* بادچ New لو العمل جديد */}
      {isNew && (
        <div className="absolute top-1.5 left-1.5 z-30 bg-gradient-to-r from-red-600 to-red-400 text-white text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full shadow-md">
          New
        </div>
      )}

      {/* التقييم */}
      <span className="absolute top-1.5 right-1.5 z-30 bg-black/80 text-yellow-400 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
        <span>⭐</span>
        {item.vote_average?.toFixed(1) || "?"}
      </span>

      {/* الاسم في الأسفل دايمًا */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent text-white px-2 py-1.5 z-20">
        <h3 className="font-semibold text-[13px] md:text-sm truncate">
          {item.title_ar || item.title_en}
        </h3>

        <div className="flex items-center justify-between text-[11px] opacity-80 mt-0.5">
          <div className="flex items-center truncate w-[75%]">
            <span>{item.type}</span>

            {item.genre_ids?.length > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-white mx-1 inline-block" />
                <span className="truncate">{item.genre_ids[0]}</span>
              </>
            )}
          </div>

          <span>{item.release_date?.slice(0, 4)}</span>
        </div>
      </div>


    </div>
  );
}
