"use client";
import Image from "next/image";
import SectionSlider from "@/components/shared/sectionSlider";
import { ArtistFullInfo } from "@/data/single_requests/fetch_artist";
import Link from "next/link";
import { Calendar, User, Globe, CalendarClock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoRow } from "@/components/details/InfoHeader";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";


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
    </>
  );
}