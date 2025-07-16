"use client";
import Image from "next/image";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from "react";
import { TMDBMovieItem } from "@/data/trending/fetch_trending";

interface HeroSectionProps {
  trending: TMDBMovieItem[];
}

export default function HeroSection({ trending }: HeroSectionProps) {
  // State to track the current slide index
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Embla carousel with autoplay plugin
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);

  // When slide changes, update selectedIndex
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  const genersJSX = (gen: number[]) => {
    return gen.map((g, i) => (
      <h2 key={i} className="flex items-center gap-2"> {g}
        {i < gen.length - 1 && <span className="w-2 h-2 rounded-full bg-white" />}
      </h2>
    ));
  };

  const trendingJSX = trending.map((media, index) => (
    <div key={index} className="min-w-full h-screen relative " dir="rtl" >
      <Image fill priority unoptimized src={media.backdrop_path} alt={media.title_ar || "خلفية"} className="object-cover" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />

      {/* Details */}
      <div className="w-full md:w-1/2 absolute bottom-1/5 left-1/2 -translate-x-1/2 text-white z-20 text-center px-5 flex flex-col gap-3">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{media.title_ar}</h1>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{media.title_en}</h1>

        {/* Overview text */}
        <p className="text-sm md:text-base lg:text-lg">
          {media.overview.slice(0, 95)}...
          <span className="text-primary text-sm cursor-pointer hover:underline mr-2">اعرف اكتر</span>
        </p>

        {/* Genre, type, release date */}
        <div className="flex justify-center flex-wrap items-center gap-2 text-white text-sm md:text-base lg:text-lg">
          {genersJSX(media.genre_ids)}
          <span className="w-1 h-5 rounded-xl bg-white" />
          {media.type}
          <span className="w-2 h-2 rounded-full bg-white" />
          {media.release_date}
        </div>
      </div>
    </div>
  ))

  return (
    <div className="w-screen min-h-screen" dir="ltr">
      <div className="overflow-hidden " ref={emblaRef}>
        <div className="flex">
          {trendingJSX}
        </div>
        {/* Navigation dots */}
        <div className="absolute bottom-20 w-full flex justify-center gap-2 z-30">
          {trending.map((_, index) => (
            <button key={index} onClick={() => emblaApi?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${selectedIndex === index ? "bg-primary w-10" : "bg-white/50"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
