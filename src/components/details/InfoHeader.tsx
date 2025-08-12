"use client";
import { CalendarDays, Clock, Film, Languages, Star, Quote, Layers, FolderKanban, LayoutList } from "lucide-react";
import getLanguageName from "@/data/local_functions/lang";
import { FullDetailsType } from "@/data/single_requests/fetch_details";
import { JSX, useEffect, useRef } from "react";
import React from "react";
import gsap from "gsap";

export const InfoRow = ({ label, value, icon: Icon }: {
  label: string;
  value: string | number | JSX.Element;
  icon?: React.FC<{ size?: number; className?: string }>;
}) => (
  <li className="flex border-b border-white/10 p-1.5 w-full xl:w-1/2 opacity-0 info-row">
    {Icon && <Icon size={18} className="text-white/90 mt-1 ml-2" />}
    <span className="text-white/90">{label}&nbsp;:&nbsp;</span>
    <span className="text-white/80">{value}</span>
  </li>
);
export default function InfoHeader({ main }: { main: FullDetailsType["main"] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const rows = containerRef.current.querySelectorAll(".info-row");
    gsap.fromTo(
      rows,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.15,
      }
    );
  }, [main]);

  return (
    <div className="space-y-2 md:space-y-3" ref={containerRef}>
      <ul className="text-sm md:text-base text-white/90 space-y-1" dir="rtl">
        <InfoRow label="النوع" value={main.type} icon={Film} />
        <InfoRow label="اللغة" value={getLanguageName(main.original_language)} icon={Languages} />
        {main.tagline && <InfoRow label="الاقتباس" value={main.tagline} icon={Quote} />}
        <InfoRow label="التقييم" value={main.vote_average} icon={Star} />
        {main.runtime && <InfoRow label="المدة" value={`${main.runtime} دقيقة`} icon={Clock} />}
        {main.number_of_seasons && <InfoRow label="عدد المواسم" value={main.number_of_seasons} icon={Layers} />}
        {main.belongs_to_collection && (
          <InfoRow label="يتبع الى" value={main.belongs_to_collection.name || "غير محدد"} icon={FolderKanban} />
        )}
        <InfoRow
          label="تاريخ الإصدار"
          value={main.type === "فيلم" ? (main.release_date || "غير متوفر") : (main.first_air_date || "غير متوفر")}
          icon={CalendarDays}
        />
        {main.genres?.length > 0 && (
          <InfoRow
            label="التصنيفات"
            icon={LayoutList}
            value={
              <span className="flex flex-wrap items-center gap-1">
                {main.genres.map((g, i, arr) => (
                  <React.Fragment key={g.id}>
                    <span>{g.name}</span>
                    {i < arr.length - 1 && <span className="w-2 h-2 rounded-full bg-white/60 mx-1 inline-block" />}
                  </React.Fragment>
                ))}
              </span>
            }
          />
        )}
      </ul>
    </div>
  );
}
