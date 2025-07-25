// src/data/single_requests/FetchFullDetails.ts
import { fetchFromTMDB } from "@/lib/tmdb";
import getVideoType from "@/data/local_functions/videoType";
import getLanguageName from "../local_functions/lang";
import getGenreNames from "../local_functions/genres";
import { MediaItem } from "@/data/HandleRequests"
export interface FullDetailsType {
  main: MainDetails;
  media: MediaDetails;
  more: {
    recommendations: MediaItem[];
  };
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
  backdrop: string | null;
  poster: string | null;
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
  width: number;
  height: number;
  aspect_ratio: number;
  iso_639_1: string | null;
  vote_average: number;
  vote_count: number;
};

type VideoType = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  published_at: string;
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
      backdrop: main.backdrop_path,
      poster: main.poster_path,
      type: type === "movie" ? "فيلم" : "مسلسل",
      original_language: getLanguageName(main.original_language),
    };

    const media: MediaDetails = {
      images: (images.backdrops?.slice(0, 5).map((img: MediaImageType) => ({
        ...img,
        file_path: img.file_path
      })) as MediaImageType[]) || [],
      videos: (videos.results as VideoType[]).slice(0, 8).map((video) => ({
        ...video,
        type: getVideoType(video.type),
      })) || [],

      cast: (credits.cast || []).map((actor: CastType): CastType => ({
        ...actor,
        profile_path: actor.profile_path
      })),
    };

    const more = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recommendations: (recommendations.results || []).slice(0, 12).map((item: any): MediaItem => ({
        id: item.id,
        title_ar: item.title || item.name || "بدون عنوان",
        title_en: item.original_title || item.original_name || "",
        original_language: item.original_language,
        genre_ids: getGenreNames(item.genre_ids) || [],
        backdrop_path: item.backdrop_path || item.poster_path
          ? `https://image.tmdb.org/t/p/original${item.backdrop_path || item.poster_path}` : "",
        poster_path: item.poster_path,
        overview: item.overview || "",
        release_date: item.release_date || item.first_air_date || "",
        type: item.media_type === "tv" || item.first_air_date ? "مسلسل" : "فيلم",
        vote_average: item.vote_average || 0,
      })),
    };

    console.log("تفاصيل العمل:", { main: mainDetails, media, more });
    return { main: mainDetails, media, more };

  } catch (err) {
    console.error("❌ فشل في جلب التفاصيل:", err);
    return null;
  }
}
