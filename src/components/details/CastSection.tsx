"use client";
// Next
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

// External Libs
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

// Types
import { FullDetailsType } from "@/data/single_requests/fetch_details";

export default function CastSection({ cast }: { cast: FullDetailsType["media"]["cast"] }) {
  const [emblaRefCast, emblaApi] = useEmblaCarousel({ loop: false, dragFree: true, direction: "rtl" });
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation with gsap
  useEffect(() => {
    if (!emblaApi) return;

    const cards = containerRef.current?.querySelectorAll(".cast-card");
    if (!cards) return;

    // Animate visible cards to fade in and slide up
    const animateVisible = () => {
      const visibleIndexes = emblaApi.slidesInView();

      cards.forEach((card, i) => {
        if (visibleIndexes.includes(i)) {
          // Animate in
          gsap.to(card, { opacity: 1, y: 0, duration: .8, ease: "power3.out" });
        } else {
          // Animate out (optional)
          gsap.to(card, { opacity: 0, y: 50, duration: .8, ease: "power3.out" });
        }
      });
    };

    gsap.fromTo(cards, { opacity: 0, y: 50, visibility:"visible" }, { 
      opacity: 1, y: 0, stagger: { amount: .8 }
    });

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
    <section  className="overflow-hidden md:mask-l-from-95%" ref={emblaRefCast}>
      <div className="flex gap-2 md:gap-3 items-stretch" ref={containerRef}>
        {cast
          .filter((a) => a.profile_path)
          .map((actor) => (
            <Link key={actor.id} href={`/details/artist/${actor.id}`}>
              <div className="cast-card invisible relative border border-white/10 bg-white/5 flex-shrink-0 rounded-xl px-3 md:px-5 py-3 md:py-5 w-[140px] sm:w-[160px] flex flex-col items-center text-center gap-2 h-full">
                <div className="relative aspect-square w-full rounded-full overflow-hidden border-2 border-white/20 bg-white/10">
                  {actor.profile_path && (
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                      alt={actor.name}
                      unoptimized
                      fill
                      sizes="(max-width: 768px) 100vw, 160px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="w-full text-center">
                  <div className="flex items-center justify-center gap-1">
                    <h3 className="flex-1 text-sm font-semibold text-white/80 truncate">
                      {actor.name}
                    </h3>
                    <ChevronLeft className="h-4 w-4 text-primary shrink-0" />
                  </div>
                  {actor.character && (
                    <p className="text-xs text-white/60 truncate">{actor.character}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}