"use server";
import { fetchFromTMDB } from "@/lib/tmdb";
import { MediaItem } from "../HandleRequests";
import getGenreNames from "../local_functions/genres";
import translateVideoType from "../local_functions/translateVideoType";
export interface FullDetailsType {
  main: MainDetails;
  media: MediaDetails;
  recommendation: MediaItem[];
}

type MainDetails = {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  tagline: string;
  runtime?: number;
  number_of_seasons?: number;
  backdrop_path: string | null;
  backdrop_blur_path: string | null;
  poster_path: string | null;
  type: "فيلم" | "مسلسل";
  original_language: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  seasons?: Array<{
    id: number;
    season_number: number;
    overview?: string;
    air_date?: string;
    episode_count?: number;
  }>;
  [key: string]: unknown;
};

type MediaDetails = {
  images: MediaImageType[];
  videos: VideoType[];
  cast: CastType[];
};

type MediaImageType = {
  file_path: string;
};

type VideoType = {
  key: string;
  name: string;
  published_at: string;
  type: string
};

type CastType = {
  id: number;
  name: string;
  character?: string;
  profile_path: string | null;
};


export default async function FetchFullDetails(
  id: string,
  type: "movie" | "tv"
): Promise<FullDetailsType | null> {
  try {
    const [main, images, videos, credits, recommendations] = await Promise.all([
      fetchFromTMDB(`/${type}/${id}`, "&language=ar"),
      fetchFromTMDB(`/${type}/${id}/images`, ""),
      fetchFromTMDB(`/${type}/${id}/videos`, ""),
      fetchFromTMDB(`/${type}/${id}/credits`, ""),
      fetchFromTMDB(`/${type}/${id}/recommendations`, "&language=ar"),
    ]);

    const mainDetails: MainDetails = {
      ...main,
      backdrop_path: `https://image.tmdb.org/t/p/original${main.backdrop_path}`,
      backdrop_blur_path: `https://image.tmdb.org/t/p/w92${main.backdrop_path}`,
      poster_path: `https://image.tmdb.org/t/p/original${main.poster_path}`,
      type: type === "movie" ? "فيلم" : "مسلسل",
    };

    const media: MediaDetails = {
      images: (images.backdrops?.slice(0, 10).map((img: MediaImageType) => ({
        ...img,
        file_path: `https://image.tmdb.org/t/p/w1280${img.file_path}`
      })) as MediaImageType[]) || [],
      videos: (videos.results || []).slice(0, 10).map((video: VideoType): VideoType => ({
        ...video,
        type: translateVideoType(video.type)
      })), cast: (credits.cast || []).slice(0, 20).map((actor: CastType): CastType => ({
        ...actor,
        profile_path: actor.profile_path
      })),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recommendation: MediaItem[] = (recommendations.results || []).map((item: any): MediaItem => ({
      id: item.id,
      title_ar: item.title || item.name || "بدون عنوان",
      title_en: item.original_title || item.original_name || "",
      genre_ids: getGenreNames(item.genre_ids) || [],
      original_language: item.original_language,
      overview: item.overview,
      backdrop_path: item.backdrop_path || item.poster_path,
      poster_path: item.poster_path,
      release_date: item.release_date || item.first_air_date || "",
      type: item.media_type === "tv" || item.first_air_date ? "مسلسل" : "فيلم",
      vote_average: item.vote_average || 0,
    }));

    console.log("تفاصيل العمل:", { main: mainDetails, media, recommendation });
    return { main: mainDetails, media, recommendation };

  } catch (err) {
    console.error("❌ فشل في جلب التفاصيل:", err);
    return null;
  }
}
