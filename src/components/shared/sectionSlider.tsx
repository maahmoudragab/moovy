"use client";
// Next
import { useRouter } from "next/navigation";
// External Libs
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
// Types
import { MediaItem } from "@/data/HandleRequests";
// Components
import MediaCard from "@/components/shared/mediaCard";
import Title from "@/components/ui/title";

interface MoviesSliderProps {
  title: string;
  path?: string | boolean;
  data: MediaItem[];
}

export default function SectionSlider({ title, data, path }: MoviesSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: true, direction: "rtl" });
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!emblaApi) return;

    const cards = containerRef.current?.querySelectorAll(".media-card");
    if (!cards) return;

    // Animate visible cards to fade in and slide up
    const animateVisible = () => {
      const visibleIndexes = emblaApi.slidesInView();

      cards.forEach((card, i) => {
        if (visibleIndexes.includes(i)) {
          // Animate in
          gsap.to(card, { opacity: 1, y: 0, duration: .8,  ease: "power3.out" });
        } else {
          // Animate out (optional)
          gsap.to(card, { opacity: 0, y: 50, duration: .8,  ease: "power3.out" });
        }
      });
    };

    // Run animation on scroll and slide change
    emblaApi.on("scroll", animateVisible);
    emblaApi.on("select", animateVisible);

    // Cleanup listeners on unmount
    return () => {
      emblaApi.off("scroll", animateVisible);
      emblaApi.off("select", animateVisible);
    };
  }, [emblaApi]);


  return (
    <section className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <Title>{title}</Title>
        {path && (
          <h3
            className="text-primary hover:underline cursor-pointer text-xs md:text-sm"
            onClick={() => router.push(`/section/${path}`)}
          >
            شاهد الكل
          </h3>
        )}
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-2 md:gap-3" ref={containerRef}>
          {data
            .filter((item) => item.poster_path)
            .map((item, i) => (
              <div key={i} className="media-card flex-shrink-0">
                <MediaCard item={item} title={title} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
