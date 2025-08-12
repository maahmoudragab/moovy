"use client";
import Image from "next/image";
import Navbar from "@/components/shared/navbar";
import SectionSlider from "@/components/shared/sectionSlider";
import { ArtistFullInfo } from "@/data/single_requests/fetch_artist";
import Link from "next/link";
import { Calendar, User, Globe, CalendarClock, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoRow } from "./details/InfoHeader";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import ScrollSmoothWrapper from "@/components/ScrollSmoothWrapper";
import Head from "next/head";

gsap.registerPlugin(SplitText);

export default function Artist({ data }: { data: ArtistFullInfo }) {

  const { artist, movies, tvShows } = data;
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = [
      titleRef.current,
      photoRef.current,
      ...Array.from(containerRef.current.querySelectorAll(".info-row")),
      ...(socialRef.current?.querySelectorAll(".btn-social") || []),
    ].filter(Boolean);

    SplitText.create(bioRef.current, {
      type: "words",
      onSplit: (self) =>
        gsap.fromTo(
          self.words,
          { y: 10, opacity: 0, visibility: "visible" },
          { y: 0, opacity: 1, delay: 0.3, stagger: { amount: .8 } }
        ),
    });

    gsap.fromTo(
      elements,
      { y: 50, opacity: 0, visibility: "visible" },
      { y: 0, opacity: 1, delay: 0.3, stagger: { amount: .8 } }
    );
  }, [artist]);

  return (
    <>
      <Head>
        <title>{data.artist.name || "تفاصيل الفنان - Moovy"}</title>
        <meta
          name="description"
          content={
            data.artist.biography ||
            "تعرف على تفاصيل الفنان، سيرته الذاتية، وأعماله في الأفلام والمسلسلات."
          }
        />
        <meta
          name="keywords"
          content={[
            data.artist.name,
            "Moovy",
            "فنان",
            "ممثل",
            "ممثلين",
            "سيرة ذاتية",
            data.artist.name || "",
          ]
            .filter(Boolean)
            .join(", ")}
        />
        <meta httpEquiv="Content-Language" content="ar" />

        {/* Open Graph */}
        <meta property="og:title" content={data.artist.name || "تفاصيل الفنان - Moovy"} />
        <meta property="og:description" content={data.artist.biography || "تعرف على تفاصيل الفنان وأعماله"} />
        <meta property="og:url" content="https://moovy.vercel.app" />
        <meta property="og:site_name" content="Moovy" />
        <meta
          property="og:image"
          content={
            data.artist.profile_path
              ? `https://image.tmdb.org/t/p/original${data.artist.profile_path}`
              : "https://moovy.vercel.app/images/moovy.webp"
          }
        />
        <meta property="og:image:alt" content={data.artist.name || "صورة الفنان"} />
        <meta property="og:type" content="profile" />
        <meta property="og:locale" content="ar_AR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.artist.name || "تفاصيل الفنان - Moovy"} />
        <meta name="twitter:description" content={data.artist.biography || "تعرف على تفاصيل الفنان وأعماله"} />
        <meta
          name="twitter:image"
          content={
            data.artist.profile_path
              ? `https://image.tmdb.org/t/p/original${data.artist.profile_path}`
              : "https://moovy.vercel.app/images/moovy.webp"
          }
        />
        <meta name="twitter:creator" content="@MoovyOfficial" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Mahmoud Ragab" />
        <meta name="rating" content="General" />
        <meta name="theme-color" content="#000000" />
      </Head>

      <Navbar />
      <ScrollSmoothWrapper>
        <main className="min-h-screen w-full pt-16 md:pt-28 px-4 md:px-8 relative z-10">
          <div className="absolute inset-0 -z-10">
            <Image
              src={`https://image.tmdb.org/t/p/w92${artist.profile_path}`}
              alt="خلفية الفنان"
              fill
              sizes="100vw"
              priority
              className="object-cover saturate-150"
            />
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-[120px]"
            />
          </div>

          {/* Artist Details */}
          <div className="flex flex-col md:flex-row gap-6 pb-8 items-center md:items-stretch">
            <div
              className="relative invisible w-[300px] h-[300px] md:w-[400px] md:h-[400px] shrink-0 overflow-hidden rounded-xl shadow-lg border-2 border-white/20"
              ref={photoRef}
            >
              <Image
                src={`https://image.tmdb.org/t/p/original${artist.profile_path}`}
                alt={artist.name}
                fill
                unoptimized
                priority
                className="object-cover"
              />
            </div>

            <div className="w-full flex flex-col justify-between self-stretch">
              <h1 ref={titleRef} className="invisible text-2xl md:text-3xl lg:text-4xl mb-3 font-bold" >
                {artist.name}
              </h1>
              <div >

                <p ref={bioRef} className="invisible text-sm md:text-base text-white/90 leading-relaxed text-justify">
                  {artist.biography || "لا يوجد معلومات لهذا الممثل"}
                </p>
              </div>

              <div className="space-y-2 md:space-y-3" ref={containerRef}>
                <ul className="text-sm md:text-base text-white/90 space-y-1" dir="rtl">
                  {artist.birthday && (
                    <InfoRow
                      label="تاريخ الميلاد"
                      value={artist.birthday}
                      icon={Calendar}
                    />
                  )}
                  {artist.age && (
                    <InfoRow
                      label="السن"
                      value={artist.age}
                      icon={CalendarClock}
                    />
                  )}
                  {artist.gender && (
                    <InfoRow
                      label="الجنس"
                      value={artist.gender}
                      icon={User}
                    />
                  )}
                  {artist.popularity && (
                    <InfoRow
                      label="الشهرة"
                      value={artist.popularity.toFixed(1)}
                      icon={Globe}
                    />
                  )}
                  {artist.place_of_birth && (
                    <InfoRow
                      label="البلد"
                      value={artist.place_of_birth}
                      icon={MapPin}
                    />
                  )}
                </ul>

                {/* Social Media Links */}
                <TooltipProvider>
                  <div ref={socialRef} className="flex flex-wrap gap-2 mt-2">
                    {artist.social?.instagram && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={artist.social.instagram} target="_blank" rel="noopener noreferrer">
                            <div className="btn-social invisible">

                              <Button
                                size="icon"
                                className="bg-white/10 rounded-full hover:opacity-80"
                              >
                                <Image src="/images/icons/instagram.png" alt="Instagram" width={18} height={18} />
                              </Button>
                            </div>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>إنستجرام</TooltipContent>
                      </Tooltip>
                    )}
                    {artist.social?.facebook && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={artist.social.facebook} target="_blank" rel="noopener noreferrer">
                            <div className="btn-social invisible">
                              <Button
                                size="icon"
                                className="bg-white/10 rounded-full hover:opacity-80"
                              >
                                <Image src="/images/icons/facebook.png" alt="Facebook" width={18} height={18} />
                              </Button>
                            </div>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>فيسبوك</TooltipContent>
                      </Tooltip>
                    )}

                    {artist.social?.tiktok && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={artist.social.tiktok} target="_blank" rel="noopener noreferrer">
                            <div className="btn-social invisible">
                              <Button
                                size="icon"
                                className="bg-white/10 rounded-full hover:opacity-80"
                              >
                                <Image src="/images/icons/tiktok.png" alt="TikTok" width={18} height={18} />
                              </Button>
                            </div>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>تيك توك</TooltipContent>
                      </Tooltip>
                    )}

                    {artist.social?.twitter && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={artist.social.twitter} target="_blank" rel="noopener noreferrer">
                            <div className="btn-social invisible">
                              <Button
                                size="icon"
                                className="bg-white/10 rounded-full hover:opacity-80"
                              >
                                <Image src="/images/icons/x.png" alt="Twitter" width={18} height={18} />
                              </Button>
                            </div>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>إكس</TooltipContent>
                      </Tooltip>
                    )}

                    {artist.social?.youtube && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={artist.social.youtube} target="_blank" rel="noopener noreferrer">
                            <div className="btn-social invisible">
                              <Button
                                size="icon"
                                className="bg-white/10 rounded-full hover:opacity-80"
                              >
                                <Image src="/images/icons/youtube.png" alt="YouTube" width={18} height={18} />
                              </Button>
                            </div>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>يوتيوب</TooltipContent>
                      </Tooltip>
                    )}

                  </div>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Section Sliders */}
          <div ref={sliderRef} className="flex flex-col gap-6">
            {movies?.length > 0 && (
              <SectionSlider
                title={"الأعمال السينمائية"}
                data={movies}
                path={false}
              />
            )}
            {tvShows?.length > 0 && (
              <SectionSlider
                title={"الأعمال التلفزيونية"}
                data={tvShows}
                path={false}
              />
            )}
          </div>
        </main>
      </ScrollSmoothWrapper>
    </>
  );
}