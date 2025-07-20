"use client";

import { MediaItem } from "@/data/HandleRequests";
import Image from "next/image";

export default function DetailsContent({ item }: { item: MediaItem }) {
  return (
    <section className="p-4 md:p-10 flex flex-col gap-6 max-w-6xl mx-auto">
      {/* 🖼️ صورة الخلفية */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
        <Image
          src={item.backdrop_path}
          alt={item.title_ar}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-4 left-4 text-white z-10">
          <h1 className="text-3xl md:text-5xl font-bold drop-shadow">
            {item.title_ar}
          </h1>
        </div>
      </div>

      {/* 📝 وصف وتفاصيل */}
      <div className="flex flex-col gap-4">
        {/* الوصف */}
        <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
          {item.overview}
        </p>

        {/* تفاصيل سريعة */}
        <div className="flex flex-wrap gap-3 text-sm md:text-base">
          <span className="bg-muted px-4 py-1 rounded-full">
            🎬 النوع: {item.type}
          </span>
          <span className="bg-muted px-4 py-1 rounded-full">
            🌐 اللغة: {item.original_language}
          </span>
          <span className="bg-muted px-4 py-1 rounded-full">
            ⭐ التقييم: {item.vote_average}
          </span>
          <span className="bg-muted px-4 py-1 rounded-full">
            🗓️ تاريخ الإصدار: {item.release_date}
          </span>
        </div>
      </div>
    </section>
  );
}
