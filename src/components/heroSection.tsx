"use client";

// ✅ استيراد الأساسيات
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ✅ المكتبات الخارجية
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// ✅ مكونات المشروع
import { MediaItem } from "@/data/HandleRequests";
import { Button } from "@/components/ui/button";
import Title from "@/components/ui/title";

export default function HeroSection({ data }: { data: MediaItem[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: "rtl" },
    [Autoplay({ delay: 16610000, stopOnInteraction: false })]
  );

  const router = useRouter();

  // ✅ لما يتغير السلايدر
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());

    emblaApi.on("select", onSelect);
    onSelect(); // أول اختيار
  }, [emblaApi]);


  // ✅ عرض التصنيفات مع الفواصل
  const renderGenres = (genres: string[] | number[]) =>
    genres.slice(0, 2).map((g, i) => (
      <h2 key={i} className="flex items-center gap-2">
        {g}
        {i < genres.length - 1 && <span className="w-2 h-2 bg-white/50 rounded-full" />
        }
      </h2>
    ));




  return (
    <section className="w-screen min-h-[100svh] relative bg-black">
      {/* الكاروسيل */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {data.map((media, index) => (
            <div
              key={index}
              className="min-w-full h-[100svh] relative"
              dir="rtl"
            >
              {/* الخلفية */}
              <Image
                fill
                priority
                unoptimized
                src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
                alt={media.title_ar || media.title_en}
                className="object-cover "
              />
              <div className=" absolute  bottom-0 left-0 w-screen h-[50%] bg-gradient-to-t from-[#09090b] to-transparent " />
              <div className="absolute bottom-35 md:bottom-24 z-20 w-full flex justify-center text-center">
                <div className="w-full md:w-3/4 lg:w-1/2 text-white space-y-2 mx-4 md:mx-8">
                  <Title >
                    {media.title_ar || media.title_en}
                  </Title>

                  {media.overview && (
                    <p className="text-sm md:text-base text-white/80 text-justify line-clamp-2">
                      {media.overview}
                    </p>
                  )}

                  <div className="flex flex-wrap justify-center items-center gap-2 text-sm md:text-base text-white/80">
                    {renderGenres(media.genre_ids)}
                    <span className="w-1 h-5 bg-white/50 rounded-full" />
                    {media.type}
                    <span className="w-2 h-2 bg-white/60 rounded-full" />
                    {media.release_date?.slice(0, 4)}
                  </div>

                  <Button
                    className="w-full rounded-full bg-white/10 border backdrop-blur-[1px] hover:bg-white/20 text-white px-6 py-2 text-sm md:text-base transition"
                    onClick={() => router.push(`/details/${media.type === "فيلم" ? "movie" : "tv"}/${media.id}`)}
                  >
                    شوف التفاصيل
                  </Button>
                </div>
              </div>



            </div>
          ))}
        </div>
      </div>

      {/* ✅ نقاط التنقل */}
      <div className="absolute bottom-25 md:bottom-10 w-full flex justify-center gap-2 z-30">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${selectedIndex === index
              ? "bg-primary w-8"
              : "bg-white/40 w-2.5"
              }`}
          />
        ))}
      </div>
    </section>

  );
}
