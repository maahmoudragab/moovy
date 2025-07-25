"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SectionSlider from "@/components/mediaSlider";
import { FullDetailsType } from "@/data/single_requests/fetch_details";
import { ChevronLeft, ChevronRight, Heart, Play } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "./ui/button";
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}
type Props = {
  item: FullDetailsType;
};

export default function DetailsContent({ item }: Props) {
  const { main, media, more } = item;
  console.log(more.recommendations)

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


  // Animation refs
  const mainRef = useRef<HTMLElement>(null)
  const sectionsRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLUListElement | null>(null);

  // useEffect(() => {
  //   const ctx = gsap.context(() => {
  //     // Animate sections with ScrollTrigger
  //     const sections = sectionsRef.current?.children
  //     if (sections) {
  //       Array.from(sections).forEach((section) => {
  //         gsap.fromTo(
  //           section,
  //           {
  //             alpha: 0,
  //             y: 60,
  //             scale: 0.95,
  //           },
  //           {
  //             alpha: 1,
  //             y: 0,
  //             scale: 1,
  //             scrollTrigger: {
  //               trigger: section,
  //               start: "top bottom",
  //               toggleActions: "play none none reverse",
  //             },
  //           },
  //         )
  //       })
  //     }
  //     const info = infoRef.current?.children
  //     if (info) {
  //       Array.from(info).forEach((info) => {
  //         gsap.fromTo(
  //           info, {
  //           opacity: 0,
  //           y: 60,
  //           scale: 0.95,
  //         },
  //           {
  //             opacity: 1,
  //             y: 0,
  //             scale: 1,
  //             duration: 4,
  //             stagger: .2
  //           },
  //         )
  //       })
  //     }

  //   }, mainRef)

  //   return () => ctx.revert()
  // }, [])


  const InfoRow = ({ label, value }: { label: string; value: string | number | React.ReactNode }) => (
    <li className="flex border-b border-white/10 p-1.5 w-full xl:w-1/2">
      <span className="text-white  font-medium">{label}&nbsp;:&nbsp;</span>
      <span className="text-white/90 font-light">{value}</span>
    </li>
  );

  const InfoHeader = () => (
    <div className="space-y-2 md:space-y-3" >
      <ul className="text-sm md:text-base text-white/90 space-y-1" dir="rtl" ref={infoRef}>
        <InfoRow label="النوع" value={main.type} />
        <InfoRow label="اللغة" value={main.original_language} />
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

  const displayName = main.title || main.name;
  const originalName = main.original_title || main.original_name;
  return (

    <main className="relative w-full" ref={mainRef}>

      {/* الخلفية */}
      <div className="absolute inset-0 -z-10">
        {main.backdrop && (
          <Image
            src={`https://image.tmdb.org/t/p/w92${main.backdrop}`}
            alt={main.name || "backdrop"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"

            className="object-cover filter saturate-400"
          />
        )}

        <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl" />
      </div>

      <section className="relative pt-16 md:pt-28 px-2 md:px-6 py-8 flex flex-col gap-6">
        <div className="absolute inset-0 -z-10 min-h-[90vh]"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w1280${main.backdrop})`,
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
            <Image
              src={`https://image.tmdb.org/t/p/original${main.poster}`}
              alt={main.name || ""}
              fill
              sizes="(max-width: 768px) 220px, (max-width: 1024px) 280px, 360px"
              unoptimized
              priority
              className="object-cover" />
          </div>

          <div className="flex flex-col flex-1 gap-4 justify-start">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
              {displayName && originalName && displayName !== originalName ? (
                <>
                  <span>{displayName}</span>
                  &nbsp;|&nbsp;
                  <span dir="ltr">{originalName}</span>
                </>
              ) : (
                <span>{displayName || originalName}</span>
              )}
            </h1>

            <p className="text-sm md:text-base text-white/90 leading-relaxed w-full xl:w-1/2" dir="rtl">
              {main.overview || "لا يوجد وصف متاح لهذا العمل."}
            </p>

            <div className="mt-auto">
              <InfoHeader />
            </div>
            <Button variant="outline" className="w-full xl:w-1/2 font-light text-sm md:text-base border-1 rounded-full">
              اضف الى المفضله
              <Heart />
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-4 md:mx-8 flex flex-col gap-3 md:gap-6" ref={sectionsRef}>
        {/* المواسم */}
        {main.seasons && main.seasons?.length > 0 && (
          <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {main.seasons.map((s) => (
              <div key={s.id} className="bg-white/10 rounded-xl p-4 flex flex-col gap-3">
                <h3 className="text-lg font-semibold">
                  {s.season_number === 0 ? "العروض الخاصة" : `الموسم ${s.season_number}`}
                </h3>
                <p className="text-sm text-white/80 whitespace-pre-line">
                  {s.overview?.trim() || "لا يوجد وصف متاح لهذا الموسم."}
                </p>
                <span className="text-xs text-white/60">
                  تاريخ الإصدار: {s.air_date || "غير متوفر"}
                </span>
                <div className="flex justify-between items-center mt-auto text-xs text-primary/80">
                  <span>عدد الحلقات: {s.episode_count || "غير متوفر"}</span>
                  <button
                    onClick={() => console.log("روح لتفاصيل الموسم:", s.id)}
                    className="flex items-center hover:text-primary hover:underline cursor-pointer"
                  >
                    <span>روح للتفاصيل</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* الكاست */}
        {media.cast && media.cast.length > 5 && (
          <section>
            <div className="overflow-hidden cursor-grab" dir="ltr" ref={emblaRefCast}>
              <div className="flex gap-3 sm:gap-4">
                {media.cast.filter((actor) => actor.profile_path).map((actor, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 bg-white/10 rounded-xl px-2 sm:px-4 py-2 sm:py-4 w-[110px] sm:w-[140px] flex flex-col items-center text-center gap-2"
                  >
                    <div className="relative aspect-square w-full rounded-full overflow-hidden border-2 border-white/50">
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                        alt={actor.name}
                        fill
                        sizes="(max-width: 640px) 110px, 140px"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold truncate w-full">{actor.name}</h3>
                    {actor.character && (
                      <p className="text-[10px] sm:text-xs text-white/70 truncate w-full">{actor.character}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* صور العمل */}
        {media.images && media.images.length > 3 && (
          <section className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl ">
            <h2 className="text-lg md:text-xl lg:text-2xl font-normal mb-4">صور من العمل</h2>
            <div className="overflow-hidden cursor-grab" dir="ltr" ref={emblaRefImages}>
              <div className="flex gap-3 sm:gap-4 min-w-full">
                {media.images.map((img, index) => (
                  <div key={index}
                    className=" flex-shrink-0 w-[80%] sm:w-1/2 md:w-1/3 xl:w-1/4 aspect-video rounded-xl overflow-hidden border border-white/20">
                    <Image
                      src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                      alt={`image-${index}`}
                      width={300} height={200}
                      className="object-cover w-full h-full" />
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
              <h2 className="text-lg md:text-xl lg:text-2xl font-normal">فيديوهات</h2>
              {/* أزرار التنقل */}
              {totalVideoPages > 1 && (
                <div className="flex justify-center items-center gap-2 text-xs text-white/60">
                  {/* السابق */}
                  <button onClick={() => setCurrentVideoPage((p) => Math.max(p - 1, 1))}
                    disabled={currentVideoPage === 1} aria-label="السابق"
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* رقم الصفحة */}
                  <span className="select-none tracking-wide text-white/80">{currentVideoPage} من {totalVideoPages} </span>

                  {/* التالي */}
                  <button onClick={() => setCurrentVideoPage((p) => Math.min(p + 1, totalVideoPages))}
                    disabled={currentVideoPage === totalVideoPages} aria-label="التالي"
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* شبكة الفيديوهات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4" dir="ltr">
              {visibleVideos.map((video, index) => {
                const isPlaying = playedVideo === video.key;
                return (
                  <div key={index} className="rounded-lg overflow-hidden border border-white/10 bg-white/5">
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
                        <Image fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                          alt={video.name} className="object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-12 h-12 p-3 rounded-full text-white bg-black/70" />
                        </div>
                      </div>
                    )}
                    <div className="p-2 text-xs text-white/70 line-clamp-1" dir="rtl">
                      <span>{video.type}</span>
                      <span></span>
                    </div>
                  </div>
                );
              })}
            </div>

          </section>
        )}

        {/* الاقتراحات */}
        {more.recommendations.length > 2 && (
          <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
            <SectionSlider title="الأقتراحات" data={more.recommendations} />
          </div>
        )}

      </div>
    </main>

  );
}
