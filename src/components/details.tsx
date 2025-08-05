"use client";

// ✅ React & Next
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ✅ External Libraries
import { ChevronLeft, Heart, Play, CheckCircle } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

// ✅ App Components
import Navbar from "@/components/shared/navbar";
import SectionSlider from "@/components/shared/mainSlider";
import PaginatedSection from "@/components/shared/paginatedSection";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";

// ✅ Utilities & Types
import getLanguageName from "@/data/local_functions/lang";
import { FullDetailsType } from "@/data/single_requests/fetch_details";

// ✅ Firebase
import {
  addToFavorites,
  removeFromFavorites,
  checkIsFavorite,
} from "@/firebase/databaseActios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { MediaItem } from "@/data/HandleRequests";

//#region 🔹 Info Sub Components
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | React.ReactNode;
}) => (
  <li className="flex border-b border-white/10 p-1.5 w-full xl:w-1/2">
    <span className="text-white/90">{label}&nbsp;:&nbsp;</span>
    <span className="text-white/80">{value}</span>
  </li>
);

const InfoHeader = ({ main }: { main: FullDetailsType["main"] }) => (
  <div className="space-y-2 md:space-y-3">
    <ul className="text-sm md:text-base text-white/90 space-y-1" dir="rtl">
      <InfoRow label="النوع" value={main.type} />
      <InfoRow label="اللغة" value={getLanguageName(main.original_language)} />
      {main.tagline && <InfoRow label="الاقتباس" value={main.tagline} />}
      <InfoRow label="التقييم" value={main.vote_average} />
      {main.runtime && (
        <InfoRow label="المدة" value={`${main.runtime} دقيقة`} />
      )}
      {main.number_of_seasons && (
        <InfoRow label="عدد المواسم" value={main.number_of_seasons} />
      )}
      {main.belongs_to_collection && (
        <InfoRow
          label="يتبع الى"
          value={main.belongs_to_collection.name || "غير محدد"}
        />
      )}
      <InfoRow
        label="تاريخ الإصدار"
        value={main.type === "فيلم" ? main.release_date : main.first_air_date}
      />
      {main.genres?.length > 0 && (
        <InfoRow
          label="التصنيفات"
          value={
            <div className="flex flex-wrap items-center gap-1">
              {main.genres.map((g, i, arr) => (
                <React.Fragment key={g.id}>
                  <span>{g.name}</span>
                  {i < arr.length - 1 && (
                    <span className="w-1 h-1 rounded-full bg-white mx-1 inline-block" />
                  )}
                </React.Fragment>
              ))}
            </div>
          }
        />
      )}
    </ul>
  </div>
);
//#endregion

//#region 🔸 Main Component
export default function DetailsContent({ item }: { item: FullDetailsType }) {
  const { main, media, recommendation, reviews } = item;
  console.log(main)

  // 🔹 States
  const [isMobile, setIsMobile] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [playedVideo, setPlayedVideo] = useState<string | null>(null);

  const router = useRouter();
  const [emblaRefCast] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    direction: "rtl",
  });

  // 🔹 Pagination States
  const imagesPerPage = 4;
  const VIDEOS_PER_PAGE = isMobile ? 2 : 4;
  const reviewsPerPage = isMobile ? 2 : 4;

  const [currentImagePage, setCurrentImagePage] = useState(1);
  const [currentVideoPage, setCurrentVideoPage] = useState(1);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);

  const totalImagePages = Math.ceil(media.images.length / imagesPerPage);
  const totalVideoPages = Math.ceil(media.videos.length / VIDEOS_PER_PAGE);
  const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage);

  const visibleImages = media.images.slice(
    (currentImagePage - 1) * imagesPerPage,
    currentImagePage * imagesPerPage
  );
  const visibleVideos = media.videos.slice(
    (currentVideoPage - 1) * VIDEOS_PER_PAGE,
    currentVideoPage * VIDEOS_PER_PAGE
  );
  const visibleReviews = reviews.slice(
    (currentReviewPage - 1) * reviewsPerPage,
    currentReviewPage * reviewsPerPage
  );

  // 🔹 Favorite Toggle
  const toggleFavorite = async () => {
    if (!user) return router.push(`/auth/login`);

    setIsLoading(true);

    const getValidTitle = (...titles: any[]): string =>
      titles.find((t) => typeof t === "string") || "";

    // جهز الداتا بصيغة FavoriteItem
    const favoriteItem: MediaItem = {
      id: main.id,
      title_ar: getValidTitle(main.title_ar, main.title),
      title_en: getValidTitle(main.title_en, main.original_title, main.name),
      original_language: main.original_language || "",
      overview: main.overview || "",
      genre_ids: (main.genres || []).map((g) => g.name), // استخدم IDs بس عشان Firestore
      backdrop_path: main.backdrop_path || "",
      poster_path: main.poster_path || "",
      release_date: main.release_date || main.first_air_date || "",
      type: main.type,
      vote_average: main.vote_average || 0,
    };


    if (isFavorite) {
      await removeFromFavorites(favoriteItem);
      setIsFavorite(false);
    } else {
      await addToFavorites(favoriteItem);
      setIsFavorite(true);
    }

    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    setIsLoading(false);
  };


  // 🔹 Detect Mobile
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  // 🔹 Check Auth Status
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const isFav = await checkIsFavorite(user.uid, main.id);
        setIsFavorite(isFav);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [main.id]);

  return (
    <>
      <Navbar />
      <main className="relative w-full">
        {/* Alert */}
        <div className={`fixed bottom-17 md:bottom-7 right-1/2 translate-x-1/2 z-45 transition-all duration-500 
          ${showAlert ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}`}>
          <Alert variant="default" className="w-fit shadow-lg overflow-hidden">
            <CheckCircle />
            <AlertTitle className="text-foreground">
              {isFavorite ? "تمت الإضافة إلى المفضلة" : "تمت الإزالة من المفضلة"}
            </AlertTitle>
            <div className="absolute bottom-0 left-0 h-1 bg-green-600 animate-pulse w-full"></div>
          </Alert>
        </div>

        {/* 🔹 Background */}
        <div className="absolute inset-0 -z-10">
          {(media.images?.[0]?.file_path || main.backdrop_blur_path) && (
            <Image
              src={`https://image.tmdb.org/t/p/w500${media.images?.[0]?.file_path || main.backdrop_blur_path
                }`}
              alt={main.name || main.title || "صورة"}
              fill
              sizes="100vw"
              priority
              className="object-cover saturate-400"
            />
          )}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl" />
        </div>

        {/* 🔹 Info Section */}
        <section className="relative pt-16 md:pt-28 px-4 md:px-8 py-8 flex flex-col gap-6">
          <div
            className="absolute inset-0 -z-10 bg-top bg-cover mask-b-from-0"
            style={{ backgroundImage: `url(${main.backdrop_path})` }}
          ></div>

          <div className="flex flex-col md:flex-row gap-6 justify-between">
            {/* Poster */}
            <div className="w-[220px] md:w-[280px] lg:w-[360px] aspect-[2/3] rounded-xl overflow-hidden border-2 border-white/10 relative shrink-0 mx-auto md:mx-0">
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

            {/* Details */}
            <div className="flex flex-col flex-1 gap-4 justify-start">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
                {(main.title || main.name) ===
                  (main.original_title || main.original_name)
                  ? main.title ||
                  main.name ||
                  main.original_title ||
                  main.original_name
                  : `${main.title || main.name} | ${main.original_title || main.original_name
                  }`}
              </h1>

              <p
                className="text-sm md:text-base text-white/90 leading-relaxed w-full xl:w-1/2 text-justify"
                dir="rtl"
              >
                {main.overview || "لا يوجد وصف متاح لهذا العمل."}
              </p>

              <div className="mt-auto">
                <InfoHeader main={main} />
              </div>

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
                      className={
                        isFavorite
                          ? "text-primary fill-primary/80"
                          : "text-white/80"
                      }
                    />
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>

        <div className="mx-4 md:mx-8 flex flex-col gap-3 md:gap-5">

          {/* المواسم */}
          {main.seasons && main.seasons.length > 0 && (
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3">
                {main.seasons.map((season) => (
                  <div
                    key={season.id}
                    className="border border-white/10 bg-white/5 rounded-xl px-2 md:px-4 py-2 md:py-4 flex flex-col gap-2 "
                  >
                    <h3 className="text-lg font-semibold">
                      {season.season_number === 0
                        ? "العروض الخاصة"
                        : `الموسم ${season.season_number}`}
                    </h3>
                    <p className="text-sm text-white/80 line-clamp-3">
                      {season.overview || "لا يوجد وصف متاح لهذا الموسم."}
                    </p>
                    <span className="text-xs text-white/60">
                      تاريخ الإصدار : {season.air_date || "غير متوفر"}
                    </span>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-xs text-primary">
                        عدد الحلقات : {season.episode_count || "غير متوفر"}
                      </span>
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
          {media.cast && media.cast.length >= 2 && (
            <section className="overflow-hidden" ref={emblaRefCast}>
              <div className="flex gap-2 md:gap-3">
                {media.cast
                  .filter((a) => a.profile_path)
                  .map((actor) => (
                    <Link
                      key={actor.id}
                      href={`/artist/${actor.id}`}
                      className="relative border border-white/10 bg-white/5 flex-shrink-0  rounded-xl px-3 md:px-5 py-3 md:py-5 w-[140px] sm:w-[160px] flex flex-col items-center text-center gap-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                    >
                      <div className="relative aspect-square w-full rounded-full overflow-hidden border-2 border-white/20  transition-colors duration-300">
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
                          <p className="text-xs text-white/65 truncate">
                            {actor.character}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          )}

          {/* صور العمل */}
          {media.images && media.images.length > 2 && (
            <PaginatedSection
              title="صور العمل"
              totalPages={totalImagePages}
              currentPage={currentImagePage}
              setCurrentPage={setCurrentImagePage}
            >
              {visibleImages.map((img, index) => (
                <div
                  key={index}
                  className="rounded-lg overflow-hidden border border-white/10 bg-white/5"
                >
                  <Image
                    src={img.file_path}
                    alt={`image-${index}`}
                    width={0}
                    height={0}
                    className="object-cover w-full "
                    unoptimized
                  />
                </div>
              ))}
            </PaginatedSection>
          )}

          {/* الفيديوهات */}
          {media.videos?.length > 0 && (
            <PaginatedSection
              title="فيديوهات العمل"
              totalPages={totalVideoPages}
              currentPage={currentVideoPage}
              setCurrentPage={setCurrentVideoPage}
            >
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
                          unoptimized
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    )}

                    <div
                      className="flex items-center justify-between gap-2 p-2 text-xs text-white/70"
                      dir="ltr"
                    >
                      <p className="text-xs text-white/65 truncate">
                        {video.published_at.split("T")[0]}
                      </p>
                      <h3 className="text-xs text-white/65 truncate">
                        {video.type}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </PaginatedSection>
          )}

          {/* ريفيوهات المشاهدين */}
          {reviews.length > 0 && (
            <PaginatedSection
              title="ريفيوهات المشاهدين"
              totalPages={totalReviewPages}
              currentPage={currentReviewPage}
              setCurrentPage={setCurrentReviewPage}
            >
              {visibleReviews.map((review, index) => (
                <div
                  key={index}
                  className="rounded-lg overflow-hidden lg:border-l-4 border border-white/10 bg-white/5 p-4 space-y-2 text-white"
                >
                  <div className="flex items-center gap-3">
                    {review.author_details.avatar_path && (
                      <Image
                        src={review.author_details.avatar_path}
                        alt={review.author}
                        unoptimized
                        width={50}
                        height={50}
                        className="rounded-full w-10 h-10 object-cover"
                      />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white/80 truncate">
                        {review.author}
                      </p>
                      <p className="text-xs text-white/65 truncate">
                        {review.created_at_formatted}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 line-clamp-3">
                    {review.content}
                  </p>
                </div>
              ))}
            </PaginatedSection>
          )}

          {/* الاقتراحات */}
          {recommendation.length > 2 && (
            <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
              <SectionSlider
                title="الأقتراحات"
                data={recommendation.slice(0, 12)}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

//#endregion
