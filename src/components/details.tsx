"use client";

import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/shared/navbar";
import SectionSlider from "@/components/MainSlider";
import getLanguageName from "@/data/local_functions/lang";
import { FullDetailsType } from "@/data/single_requests/fetch_details";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

type Props = {
  item: FullDetailsType;
};

export default function DetailsContent({ item }: Props) {
  const { main, media, more } = item;

  const [emblaRefCast] = useEmblaCarousel({ loop: false, dragFree: true });
  const [emblaRefImages] = useEmblaCarousel({ loop: false, dragFree: true });
  const [playedVideo, setPlayedVideo] = useState<string | null>(null);

  // Pagination for videos
  const [currentVideoPage, setCurrentVideoPage] = useState(1);
  const VIDEOS_PER_PAGE = 4;
  const totalVideoPages = Math.ceil(media.videos.length / VIDEOS_PER_PAGE);
  const visibleVideos = media.videos.slice(
    (currentVideoPage - 1) * VIDEOS_PER_PAGE,
    currentVideoPage * VIDEOS_PER_PAGE
  );


  const InfoRow = ({ label, value }: { label: string; value: string | number | React.ReactNode }) => (
    <li className="flex border-b border-white/10 p-1.5 w-full xl:w-1/2">
      <span className="text-white">{label}&nbsp;:&nbsp;</span>
      <span className="text-white/90">{value}</span>
    </li>
  );

  const InfoHeader = () => (
    <div className="space-y-2 md:space-y-3">
      <ul className="text-sm md:text-base text-white/90 space-y-1" dir="rtl">
        <InfoRow label="النوع" value={main.type} />
        <InfoRow label="اللغة" value={getLanguageName(main.original_language)} />
        {main.tagline && <InfoRow label="الاقتباس" value={main.tagline} />}
        <InfoRow label="التقييم" value={main.vote_average} />
        {main.runtime && <InfoRow label="المدة" value={`${main.runtime} دقيقة`} />}
        {main.number_of_seasons && <InfoRow label="عدد المواسم" value={main.number_of_seasons} />}
        <InfoRow label="تاريخ الإصدار" value={main.type === "فيلم" ? main.release_date : main.first_air_date} />
        {Array.isArray(main.genres) && main.genres.length > 0 && (
          <InfoRow
            label="التصنيفات"
            value={
              <div className="flex flex-wrap items-center gap-1">
                {main.genres.map((g, i, arr) => (
                  <React.Fragment key={g.name}>
                    <span>{g.name}</span>
                    {i < arr.length - 1 && <span className="w-1 h-1 rounded-full bg-white mx-1 inline-block" />}
                  </React.Fragment>
                ))}
              </div>
            }
          />
        )}
      </ul>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="relative w-full min-h-[300vh] text-white">

        {/* الخلفية */}
        <div className="absolute inset-0 -z-10">
          <Image src={main.backdrop || ""} alt={main.name || ""} quality={1} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl" />
        </div>

        <section className="relative pt-16 md:pt-28 px-2 md:px-6 py-8 flex flex-col gap-6">
          <div className="absolute inset-0 -z-10 min-h-[90vh]"
            style={{
              backgroundImage: `url(${main.backdrop})`,
              backgroundPosition: "top center",
              backgroundSize: "cover",
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0) 98%)",
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0) 98%)",
              WebkitMaskSize: "100% 100%", maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", filter: "brightness(0.5)"
            }} />

          {/* التفاصيل */}
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="w-[220px] md:w-[280px] lg:w-[360px] aspect-[2/3] rounded-xl overflow-hidden border-2 border-white/20 relative shrink-0 mx-auto md:mx-0">
              <Image src={main.poster || ""} alt={main.name || ""} fill unoptimized priority className="object-cover" />
            </div>

            <div className="flex flex-col flex-1 gap-4 justify-start">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
                <span>{main.title || main.name}</span>
                &nbsp;|&nbsp;
                <span dir="ltr">{main.original_title || main.original_name}</span>
              </h1>

              <p className="text-sm md:text-base text-white/90 leading-relaxed w-full xl:w-1/2" dir="rtl">
                {main.overview || "لا يوجد وصف متاح لهذا العمل."}
              </p>

              <div className="mt-auto">
                <InfoHeader />
              </div>
            </div>
          </div>
        </section>

        <div className="mx-4 md:mx-8 flex flex-col gap-3 md:gap-6">

          {/* المواسم */}
          {main.seasons && main.seasons.length > 0 && (
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {main.seasons.map((season) => (
                  <div key={season.id} className="bg-white/10 rounded-xl px-2 md:px-4 py-2 md:py-4 flex flex-col gap-2 min-h-[180px]">
                    <h3 className="text-lg font-semibold">
                      {season.season_number === 0 ? "العروض الخاصة" : `الموسم ${season.season_number}`}
                    </h3>
                    <p className="text-sm text-white/80 line-clamp-3">{season.overview || "لا يوجد وصف متاح لهذا الموسم."}</p>
                    <span className="text-xs text-white/60">تاريخ الإصدار : {season.air_date || "غير متوفر"}</span>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-xs text-primary">عدد الحلقات : {season.episode_count || "غير متوفر"}</span>
                      <div className="flex items-center cursor-pointer text-primary/80 hover:text-primary hover:underline">
                        <span className="text-xs">روح للتفاصيل</span>
                        <ChevronLeft className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* الكاست */}
          {media.cast && media.cast.length > 0 && (
            <section>
              <div className="overflow-hidden" dir="ltr" ref={emblaRefCast}>
                <div className="flex gap-4">
                  {media.cast.map((actor, index) => (
                    <div key={index} className="flex-shrink-0 bg-white/10 rounded-xl px-2 md:px-4 py-2 md:py-4 w-[140px] sm:w-[160px] flex flex-col items-center text-center gap-2">
                      <div className="relative aspect-square w-full rounded-full overflow-hidden border-2 border-white/50">
                        {actor.profile_path && (
                          <Image src={actor.profile_path} alt={actor.name} fill unoptimized className="object-cover" />
                        )}
                      </div>
                      <h3 className="text-sm font-semibold truncate w-full">{actor.name}</h3>
                      {actor.character && <p className="text-xs text-white/70 truncate w-full">{actor.character}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* صور العمل */}
          {media.images && media.images.length > 0 && (
            <section className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-4">صور العمل</h2>
              <div className="overflow-hidden" dir="ltr" ref={emblaRefImages}>
                <div className="flex gap-4 min-w-full">
                  {media.images.map((img, index) => (
                    <div
                      key={index}
                      className=" flex-shrink-0 w-[80%] sm:w-1/2 md:w-1/3 xl:w-1/4 aspect-video rounded-xl overflow-hidden border border-white/20">
                      <Image
                        src={img.file_path}
                        alt={`image-${index}`}
                        width={300}
                        height={200}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </div>


            </section>
          )}

          {/* فيديوهات بباجنيشن */}
          {media.videos && media.videos.length > 0 && (
            <section className="px-2 md:px-4 py-4 bg-[#ffffff1a] border border-white/10 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-semibold text-white">فيديوهات</h2>
                {/* أزرار التنقل */}
                {totalVideoPages > 1 && (
                  <div className="flex justify-center items-center gap-2 text-xs text-white/60">
                    {/* السابق */}
                    <button
                      onClick={() => setCurrentVideoPage((p) => Math.max(p - 1, 1))}
                      disabled={currentVideoPage === 1}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="السابق"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* رقم الصفحة */}
                    <span className="select-none tracking-wide text-white/80">
                      {currentVideoPage} من {totalVideoPages}
                    </span>

                    {/* التالي */}
                    <button
                      onClick={() => setCurrentVideoPage((p) => Math.min(p + 1, totalVideoPages))}
                      disabled={currentVideoPage === totalVideoPages}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="التالي"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* شبكة الفيديوهات */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" dir="ltr">
                {visibleVideos.map((video, index) => {
                  const isPlaying = playedVideo === video.key;
                  return (
                    <div
                      key={index}
                      className="rounded-lg overflow-hidden border border-white/10 bg-white/5"
                    >
                      {isPlaying ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${video.key}?autoplay=1`}
                          title={video.name}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          sandbox="allow-same-origin allow-scripts allow-presentation allow-popups allow-popups-to-escape-sandbox"
                          className="w-full aspect-video"
                        />
                      ) : (
                        <div
                          onClick={() => setPlayedVideo(video.key)}
                          className="relative w-full aspect-video cursor-pointer"
                        >
                          <Image
                            fill
                            src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                            alt={video.name}
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="p-2 text-xs text-white/70 text-center line-clamp-1" dir="ltr">
                        {video.name}
                      </div>
                    </div>
                  );
                })}
              </div>

            </section>
          )}

          {/* الاقتراحات */}
          <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
            <SectionSlider title="الأقتراحات" data={more.recommendations} />
          </div>

        </div>
      </main>
    </>
  );
}
