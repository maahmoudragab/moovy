"use client";
import Image from "next/image";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from "react";
import { MediaItem } from "@/data/HandleRequests";

interface HeroSectionProps {
  data: MediaItem[];
}

export default function HeroSection({ data }: HeroSectionProps) {
  // State to track the current slide index
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Embla carousel with autoplay plugin
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 115000, stopOnInteraction: false })]);

  // When slide changes, update selectedIndex
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  // useEffect(() => {
  //   gsap.fromTo(".gsap-anmi > div,.gsap-anmi > h1,.gsap-anmi > p", {
  //     alpha: 0,
  //     y: 50,
  //   }, {
  //     y: 0,
  //     alpha: 1,
  //     ease: "power2.inOut",
  //     duration: .5,
  //     stagger: .5
  //   })
  // }, [selectedIndex]);

  const genersJSX = (gen: number[]) => {
    return gen.map((g, i) => (
      <h2 key={i} className="flex items-center gap-2"> {g}
        {i < gen.length - 1 && <span className="w-2 h-2 rounded-full bg-white" />}
      </h2>
    ));
  };

  const trendingJSX = data.map((media, index) => (
    <div key={index} className="min-w-full h-screen relative " dir="rtl" >
      <Image fill priority unoptimized src={media.backdrop_path} alt={media.title_ar || "خلفية"} className="object-cover" />

      {/* Gradient overlay */}
      <div className="absolute w-full h-[500px] bottom-0 bg-gradient-to-t from-[#09090b] to-transparent z-10" />

      {/* Details */}
      <div className="gsap-anmi w-full md:w-1/2 absolute bottom-1/5 left-1/2 -translate-x-1/2 text-white z-20 text-center px-5 flex flex-col gap-3">

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{media.title_ar || media.title_en}</h1>

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
<section className="w-screen min-h-screen relative" dir="ltr">
  <div className="overflow-hidden" ref={emblaRef}>
    <div className="flex ">
      {trendingJSX}
    </div>
  </div>

  {/* ✅ خلي الكرات هنا بعد الـ embla */}
  <div className="absolute bottom-20 w-full flex justify-center gap-2 z-30">
    {data.map((_, index) => (
      <button key={index}
        onClick={() => emblaApi?.scrollTo(index)}
        className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${selectedIndex === index ? "bg-primary w-10" : "bg-primary/40"}`} />
    ))}
  </div>
</section>

  );
}
