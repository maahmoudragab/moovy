"use client";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { PopularMoviesItem } from "@/data/movies/fetch_popular_movies";
import { useState, useEffect } from "react";
import Link from "next/link";

interface MoviesSliderProps {
  title: string;
  data: PopularMoviesItem[];
}

export default function SectionSlider({ title, data }: MoviesSliderProps) {
  const [emblaRef] = useEmblaCarousel({ loop: false, dragFree: true });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      }
    };
    checkMobile();
  }, []);

  return (
    <section className="px-4 md:px-8">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl md:text-4xl font-bold text-white">{title}</h2>
        {title !== "الأعمال القادمة" && (
          <h3 className="text-yellow-400 hover:underline cursor-pointer">شوف أكتر</h3>
        )}
      </div>

      <div className="overflow-hidden" dir="ltr" ref={emblaRef}>
        <div className="flex gap-4">
          {data.map((movie) => {
            const isNew = movie.release_date
              ? (Date.now() - new Date(movie.release_date).getTime()) / 86400000 <= 30
              : false;

            return (
              <Link key={movie.id} href={`/details/${movie.type === "فيلم" ? "movie" : "tv"}/${movie.id}`}>

                <div dir="rtl"
                  className="cursor-pointer group relative aspect-[2/3] w-[130px] sm:w-[160px] md:w-[200px] lg:w-[220px] flex-shrink-0 rounded-xl overflow-hidden transition-all duration-500">
                  <Image
                    src={movie.poster_path}
                    alt={movie.title_ar}
                    fill unoptimized
                    className="object-cover"
                  />

                  {/* الترانزيشن بتاع الداتا */}
                  {!isMobile && (
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent text-white px-3 py-2 z-20 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 space-y-1">
                      <h3 className="font-bold text-sm md:text-base truncate">{movie.title_ar}</h3>
                      <div className="flex items-center justify-between text-xs opacity-85">
                        {movie.genre_ids && (
                          <p className="text-[10px] opacity-70 truncate w-1/2">{movie.genre_ids.join("، ")}</p>
                        )}
                        <span>{movie.release_date?.slice(0, 4)}</span>
                      </div>
                    </div>
                  )}


                  {/* لو الفيلم جديد */}
                  {isNew && (
                    <div className="absolute top-1 left-1 z-30 bg-gradient-to-r from-red-600 to-red-400 text-white text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full shadow-md">
                      New
                    </div>
                  )}

                  {/* التقييم */}
                  <span className="absolute top-1 right-1 z-30 bg-black/80 text-yellow-400 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
                    <span className="text-inherit">⭐</span>
                    {movie.vote_average?.toFixed(1)}
                  </span>

                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section >
  );
}
