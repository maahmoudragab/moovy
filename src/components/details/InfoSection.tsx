"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import InfoHeader from "@/components/details/InfoHeader";
import { FullDetailsType } from "@/data/single_requests/fetch_details";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export default function InfoSection({
  main,
  isLoading,
  isFavorite,
  toggleFavorite,
}: {
  main: FullDetailsType["main"];
  isLoading: boolean;
  isFavorite: boolean;
  toggleFavorite: () => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const overviewRef = useRef<HTMLParagraphElement>(null);
  const infoHeaderRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    if (overviewRef.current) {
      SplitText.create(overviewRef.current, {
        type: "words",
        onSplit: (self) =>
          gsap.fromTo(self.words,
            { y: 10, opacity: 0, visibility: "visible" },
            { y: 0, opacity: 1, delay: 0.2, stagger: { amount: 0.8 } }
          ),
      });
    }

    const elements = [titleRef.current, infoHeaderRef.current, buttonRef.current].filter(Boolean);
    const commonProps = { y: 0, opacity: 1, delay: 0.2 };

    gsap.fromTo(elements, { y: 50, opacity: 0, visibility: "visible" }, { ...commonProps, stagger: { amount: .8 } });
    gsap.fromTo(posterRef.current, { y: 50, opacity: 0, visibility: "visible" }, { ...commonProps, duration: 1 });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative pt-16 md:pt-28 px-4 md:px-8 py-8 flex flex-col gap-6"
    >
      <div
        className="absolute inset-0 brightness-70 -z-10 bg-top bg-cover mask-b-from-50%"
        style={{ backgroundImage: `url(${main.backdrop_path})` }}
      ></div>
      <div className="flex flex-col md:flex-row gap-6 justify-between">
        <div ref={posterRef} className="w-[220px] invisible md:w-[280px] lg:w-[360px] aspect-[2/3] rounded-xl overflow-hidden border-2 border-white/10 relative shrink-0 mx-auto md:mx-0">
          <Image
            src={main.poster_path!}
            alt={main.name || main.title || "صورة"}
            fill
            sizes="(max-width: 768px) 220px, (max-width: 1024px) 280px, 360px"
            unoptimized
            priority
            className="object-cover"
          />
        </div>
        <div className="flex flex-col flex-1 gap-4 justify-start">
          <h1 ref={titleRef} className="title text-2xl md:text-4xl lg:text-5xl font-bold invisible">
            {(main.title || main.name) === (main.original_title || main.original_name)
              ? main.title || main.name || main.original_title || main.original_name
              : `${main.title || main.name} | ${main.original_title || main.original_name}`}
          </h1>
          <p ref={overviewRef} className="overview invisible text-sm md:text-base text-white/90 w-full xl:w-1/2 text-justify">
            {main.overview || "لا يوجد وصف متاح لهذا العمل."}
          </p>
          <div ref={infoHeaderRef} className="info-header mt-auto invisible">
            <InfoHeader main={main} />
          </div>
          <div ref={buttonRef} className="button invisible">
            <Button

              onClick={toggleFavorite}
              className="w-full xl:w-1/2 border border-white/10 bg-white/5 hover:bg-white/10 text-white/90 rounded-lg flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <span>جاري التحديث...</span>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              ) : (
                <>
                  {isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                  <Heart
                    size={16}
                    className={isFavorite ? "text-primary fill-primary/80" : "text-white/80"}
                  />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}