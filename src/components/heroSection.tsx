"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { MediaItem } from "@/data/HandleRequests";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeroSectionProps {
  data: MediaItem[];
}

export default function HeroSection({ data }: HeroSectionProps) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 16610000, stopOnInteraction: false })]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  const renderGenres = (genres: number[]) =>
    genres.map((g, i) => (
      <h2 key={i} className="flex items-center gap-2">
        {g}
        {i < genres.length - 1 && (
          <span className="w-2 h-2 rounded-full bg-white" />
        )}
      </h2>
    ));

  return (
    <section className="w-screen min-h-screen relative" dir="ltr">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {data.map((media, index) => (
            <div key={index} className="min-w-full h-screen relative" dir="rtl">
              <Image fill priority unoptimized src={media.backdrop_path} alt={media.title_ar || "خلفية"} className="object-cover" />

              {/* Gradient overlay */}
              <div className="absolute w-full h-[500px] bottom-0 bg-gradient-to-t from-[#09090b] to-transparent z-10" />

              <div className="gsap-anmi w-full md:w-1/2 absolute bottom-1/4 md:bottom-1/7 left-1/2 -translate-x-1/2 text-white z-20 text-center px-5 flex flex-col gap-3">
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
                  {media.title_ar || media.title_en}
                </h1>

                {media.overview && (
                  <p className="text-xs md:text-sm lg:text-base text-white/90">
                    {`${media.overview.slice(0, 95)}...`}
                  </p>
                )}


                <div className="flex justify-center flex-wrap items-center gap-2 text-xs md:text-sm text-white/90">
                  {renderGenres(media.genre_ids)}
                  <span className="w-1 h-5 rounded-xl bg-white" />
                  {media.type}
                  <span className="w-2 h-2 rounded-full bg-white" />
                  {media.release_date?.slice(0, 4)}
                </div>

                <div className="flex justify-center flex-wrap items-center gap-1 md:gap-2 mt-2">

                  <Button variant="default" size="sm" className="text-xs" onClick={() => router.push(`/details/${media.type == "فيلم" ? "movie" : "tv"}/${media.id}`)}>شوف التفاصيل</Button>
                  <Button variant="icon" size="sm" className="text-xs"><Heart /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-35 md:bottom-15 w-full flex justify-center gap-2 z-30">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${selectedIndex === index ? "bg-primary w-8" : "bg-primary/40"
              }`}
          />
        ))}
      </div>
    </section>
  );
}
