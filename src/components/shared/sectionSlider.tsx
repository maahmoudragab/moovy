"use client";
// Next
import { useRouter } from "next/navigation";

// External Libs
import useEmblaCarousel from "embla-carousel-react";

// Types
import { MediaItem } from "@/data/HandleRequests";

// App Components
import MediaCard from "@/components/shared/mediaCard";
import Title from "@/components/ui/title";


interface MoviesSliderProps {
  title: string;
  path?: string | boolean;
  data: MediaItem[];
}

export default function SectionSlider({ title, data, path }: MoviesSliderProps) {
  const [emblaRef] = useEmblaCarousel({ loop: false, dragFree: true, direction: 'rtl' });
  const router = useRouter();

  return (
    <section className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <Title>{title}</Title>
        {path && (
          <h3 className="text-primary hover:underline cursor-pointer text-xs md:text-sm"
            onClick={() => router.push(`/section/${path}`)}
          >شاهد الكل</h3>
        )}
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-2 md:gap-3">
          {data.filter((i) => i.poster_path) && (
            data
              .filter((i) => i.poster_path)
              .map((item, i) => (
                <MediaCard key={i} item={item} title={title} />
              ))
          )}
        </div>
      </div>
    </section >
  );
}
