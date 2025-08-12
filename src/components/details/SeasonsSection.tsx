import { useState } from "react";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PaginatedSection from "@/components/shared/paginatedSection";
import Title from "@/components/ui/title";
import { FullDetailsType } from "@/data/single_requests/fetch_details";

export default function SeasonsSection({ seasons }: { seasons: FullDetailsType["main"]["seasons"] }) {
  const [selectedSeason, setSelectedSeason] = useState(
    seasons?.find((s) => s.season_number === 1) || seasons?.[0]
  );
  const [currentEpisodePage, setCurrentEpisodePage] = useState(1);
  const episode_per_page = 4;
  const totalEpisodePages = Math.ceil((selectedSeason?.episodes?.length || 0) / episode_per_page);
  const visibleEpisodes = selectedSeason?.episodes?.slice(
    (currentEpisodePage - 1) * episode_per_page,
    currentEpisodePage * episode_per_page
  );

  if (!seasons || seasons.length === 0) return null;

  return (
    <section className="w-full flex flex-col gap-3 md:gap-5">
      <div data-lag=".6" className="flex items-center justify-between gap-2">
        <Title>المواسم</Title>
        <div className="w-[140px] md:w-72">
          <Select
            value={selectedSeason?.id?.toString()}
            onValueChange={(value) => {
              const season = seasons?.find((s) => s.id === Number(value));
              setSelectedSeason(season);
            }}
            dir="rtl"
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white w-full">
              <SelectValue placeholder="اختر الموسم" />
            </SelectTrigger>
            <SelectContent className="bg-white/10 text-white backdrop-blur-md">
              {seasons.map((season) => (
                <SelectItem key={season.id} value={season.id.toString()}>
                  {season.season_number === 0 ? "العروض الخاصة" : `الموسم ${season.season_number}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {selectedSeason && (
        <>
          <div data-lag=".6" className="border rounded-xl px-2 md:px-4 py-2 bg-[#ffffff1a]">
            <Title className="mb-4">
              {selectedSeason.season_number === 0 ? "العروض الخاصة" : `الموسم ${selectedSeason.season_number}`}
            </Title>
            <p className="text-sm text-white/80 mb-1">
              {selectedSeason.overview || "لا يوجد وصف متاح لهذا الموسم."}
            </p>
            <p className="text-sm text-white/80">
              تاريخ الإصدار : {selectedSeason.air_date || "غير متوفر"}
            </p>
          </div>
          {selectedSeason.episodes && selectedSeason.episodes.length > 0 && (
            <PaginatedSection
              title={`الحلقات : ${selectedSeason.episode_count || selectedSeason.episodes?.length || "غير متوفر"}`}
              totalPages={totalEpisodePages}
              currentPage={currentEpisodePage}
              setCurrentPage={setCurrentEpisodePage}
            >
              {visibleEpisodes?.map((ep) => (
                <div key={ep.id} className="rounded-lg overflow-hidden border border-white/10 bg-white/5">
                  <div className="relative w-full aspect-video">
                    {ep.still_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w1280${ep.still_path}`}
                        alt={ep.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/50 text-sm">
                        لا توجد صورة
                      </div>
                    )}
                    {ep.runtime && (
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                        {ep.runtime} د
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col gap-1 text-white">
                    <h4 className="text-sm font-bold">
                      الحلقة {ep.episode_number}: {ep.name}
                    </h4>
                    <p className="text-xs text-white/70 line-clamp-3">
                      {ep.overview || "لا يوجد وصف"}
                    </p>
                  </div>
                </div>
              ))}
            </PaginatedSection>
          )}
        </>
      )}
    </section>
  );
}