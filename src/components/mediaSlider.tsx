"use client";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { PopularMoviesItem } from "@/data/movies/fetch_popular_movies";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface MoviesSliderProps {
  title: string;
  path?: string;
  data: PopularMoviesItem[];
}

export default function SectionSlider({ path, title, data }: MoviesSliderProps) {
  const [emblaRef] = useEmblaCarousel({ loop: false, dragFree: true });
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const handleNavigate = (id: number, type: string) => {
    router.push(`/details/${type === "مسلسل" ? "tv" : "movie"}/${id}`);
  };

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    }
  }, []);


  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl lg:text-2xl font-medium">{title}</h2>
        {title !== "الأعمال القادمة" && title !== "الأقتراحات" && (
          <h3 className="text-primary hover:underline cursor-pointer text-xs md:text-sm"
            onClick={() => router.push(`/section/${path}`)}>شاهد الكل</h3>
        )}
      </div>

      <div className="overflow-hidden" dir="ltr" ref={emblaRef}>
        <div className="flex gap-3 sm:gap-4">
          {data.filter((item) => item.poster_path).map((movie) => {
            const isNew = movie.release_date
              ? (Date.now() - new Date(movie.release_date).getTime()) / 86400000 <= 30
              : false;

            return (
              <div
                key={movie.id}
                dir="rtl"
                onClick={() => handleNavigate(movie.id, movie.type)}
                className="cursor-pointer group relative aspect-[2/3] w-[120px] sm:w-[135px] md:w-[150px] lg:w-[170px] flex-shrink-0 rounded-xl overflow-hidden transition-all duration-500"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                  alt={movie.title_ar}
                  fill sizes="(max-width: 768px) 220px, (max-width: 1024px) 280px, 360px"
                  unoptimized className="object-cover" loading={isMobile ? "lazy" : "eager"}
                />

                {!isMobile && (
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent text-white px-3 py-2 z-20 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 space-y-1">
                    <h3 className="font-bold text-sm md:text-base truncate">{movie.title_ar}</h3>
                    <div className="flex items-center justify-between text-xs opacity-85">
                      {movie.genre_ids && (
                        <p className="text-[10px] opacity-70 truncate w-[70%]">{movie.genre_ids.join("، ")}</p>
                      )}
                      <span>{movie.release_date?.slice(0, 4)}</span>
                    </div>
                  </div>
                )}

                {isNew && title !== "الأعمال القادمة" && (
                  <div className="absolute top-1.5 left-1.5 z-30 bg-gradient-to-r from-red-600 to-red-400 text-white text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full shadow-md">New</div>
                )}

                <span className="absolute top-1.5 right-1.5 z-30 bg-black/80 text-yellow-400 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
                  <span className="text-inherit">⭐</span>
                  {movie.vote_average?.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
