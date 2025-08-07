import Image from "next/image"
import Navbar from "@/components/shared/navbar"
import SectionSlider from "@/components/shared/sectionSlider"
import { ArtistFullInfo } from "@/data/single_requests/fetch_artist"
import Link from "next/link";

import { Calendar, User, Globe, CalendarClock, MapPin } from "lucide-react";
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


type InfoRowProps = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
};

const InfoRow = ({ label, value, icon }: InfoRowProps) => (
  <li className="flex border-b border-white/10 p-1.5 w-full">
    {icon && <span className="ml-2">{icon}</span>}
    <span className="text-white/90">{label}&nbsp;:&nbsp;</span>
    <span className="text-white/80">{value}</span>
  </li>
);


export default function Artist({ data }: { data: ArtistFullInfo }) {
  const { artist, movies, tvShows } = data

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full pt-16 md:pt-28 px-4 md:px-8 relative z-10">
        <div className="absolute inset-0 -z-10">
          <Image
            src={`https://image.tmdb.org/t/p/w92${artist.profile_path}`}
            alt="خلفية الفنان"
            fill
            sizes="100vw"
            priority
            className="object-cover saturate-200"
          />
          <div
            className="absolute inset-0 bg-black/40"
            style={{ backdropFilter: "blur(200px)" }}
          />
        </div>

        {/* ✅ بيانات الفنان */}
        <div className="flex flex-col md:flex-row gap-6 pb-8 items-center md:items-stretch">
          <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] shrink-0 overflow-hidden rounded-xl shadow-lg border-2 border-white/20">
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
            <h1 className="text-2xl md:text-3xl lg:text-4xl mb-3 font-bold">{artist.name}</h1>
            <p className="text-sm md:text-base text-white/90 leading-relaxed text-justify">{artist.biography}</p>

            <div className="space-y-2 md:space-y-3 ">
              <ul className="text-sm md:text-base  text-white/90 space-y-1" dir="rtl">


                {artist.birthday && (
                  <InfoRow label="تاريخ الميلاد" value={artist.birthday} icon={<Calendar size={18} />} />
                )}
                {artist.age && (
                  <InfoRow label="السن" value={artist.age} icon={<CalendarClock size={18} />} />
                )}
                {artist.gender && (
                  <InfoRow label="الجنس" value={artist.gender} icon={<User size={18} />} />
                )}
                {artist.popularity && (
                  <InfoRow label="الشهرة" value={artist.popularity.toFixed(1)} icon={<Globe size={18} />} />
                )}
                {artist.place_of_birth && (
                  <InfoRow label="البلد" value={artist.place_of_birth} icon={<MapPin size={18} />} />
                )}
              </ul>
              <TooltipProvider>
                <div className="flex flex-wrap gap-2 mt-2">
                  {artist.social?.instagram && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={artist.social.instagram} target="_blank" rel="noopener noreferrer">
                          <Button size="icon" className="bg-white/10 rounded-full hover:opacity-50">
                            <Image src="/images/icons/instagram.png" alt="Instagram" width={18} height={18} />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>إنستجرام</TooltipContent>
                    </Tooltip>
                  )}

                  {artist.social?.facebook && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={artist.social.facebook} target="_blank" rel="noopener noreferrer">
                          <Button size="icon" className="bg-white/10 rounded-full hover:opacity-50">
                            <Image src="/images/icons/facebook.png" alt="Facebook" width={18} height={18} />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>فيسبوك</TooltipContent>
                    </Tooltip>
                  )}

                  {artist.social?.tiktok && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={artist.social.tiktok} target="_blank" rel="noopener noreferrer">
                          <Button size="icon" className="bg-white/10 rounded-full hover:opacity-50">
                            <Image src="/images/icons/tiktok.png" alt="TikTok" width={18} height={18} />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>تيك توك</TooltipContent>
                    </Tooltip>
                  )}

                  {artist.social?.twitter && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={artist.social.twitter} target="_blank" rel="noopener noreferrer">
                          <Button size="icon" className="bg-white/10 rounded-full hover:opacity-50">
                            <Image src="/images/icons/x.png" alt="Twitter" width={18} height={18} />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>إكس</TooltipContent>
                    </Tooltip>
                  )}

                  {artist.social?.youtube && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={artist.social.youtube} target="_blank" rel="noopener noreferrer">
                          <Button size="icon" className="bg-white/10 rounded-full hover:opacity-50">
                            <Image src="/images/icons/youtube.png" alt="YouTube" width={18} height={18} />
                          </Button>
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

        {/* ✅ أعماله */}
        <div className="flex flex-col gap-6">
          {movies?.length > 0 && (
            <SectionSlider
              title="الأفلام التي شارك بها"
              data={movies}
              path="actor-movies"
            />
          )}

          {tvShows?.length > 0 && (
            <SectionSlider
              title="المسلسلات التي شارك بها"
              data={tvShows}
              path="actor-tv"
            />
          )}

        </div>
      </main>
    </>
  )
}
