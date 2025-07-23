// src/data/single_requests/FetchFullDetails.ts
import { fetchFromTMDB } from "@/lib/tmdb";

export interface FullDetailsType {
  main: MainDetails;
  media: MediaDetails;
  more: {
    recommendations: RecommendationType[];
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
  posters: MediaImageType[];
  logos: MediaImageType[];
  videos: VideoType[];
  cast: CastType[];
  crew: CrewType[];
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

type CrewType = {
  id: number;
  name: string;
  job?: string;
  profile_path: string | null;
};

export type RecommendationType = {
  id: number;
  title_ar: string;
  title_en: string;
  original_language: string;
  overview: string;
  genre_ids: number[];
  backdrop_path: string;
  poster_path: string;
  release_date?: string;
  type: "فيلم" | "مسلسل";
  vote_average: number;
};

export default async function FetchFullDetails(
  id: string,
  type: "movie" | "tv"
): Promise<FullDetailsType | null> {
  const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"; // تقدر تخليها original لو عايز

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
      backdrop: main.backdrop_path
        ? `https://image.tmdb.org/t/p/original${main.backdrop_path}`
        : null,
      poster: main.poster_path
        ? `https://image.tmdb.org/t/p/w1280${main.poster_path}`
        : null,
      type: type === "movie" ? "فيلم" : "مسلسل",
    };

    const media: MediaDetails = {
      images: (images.backdrops?.slice(0, 10).map((img: MediaImageType) => ({
        ...img,
        file_path: img.file_path
          ? `${TMDB_IMAGE_BASE}${img.file_path}`
          : null,
      })) as MediaImageType[]) || [],

      posters: (images.posters?.slice(0, 10).map((img: MediaImageType) => ({
        ...img,
        file_path: img.file_path
          ? `${TMDB_IMAGE_BASE}${img.file_path}`
          : null,
      })) as MediaImageType[]) || [],

      logos: (images.logos?.slice(0, 3).map((img: MediaImageType) => ({
        ...img,
        file_path: img.file_path
          ? `${TMDB_IMAGE_BASE}${img.file_path}`
          : null,
      })) as MediaImageType[]) || [],

      videos: (videos.results as VideoType[]) || [],

      cast: (credits.cast || []).map((actor: CastType): CastType => ({
        ...actor,
        profile_path: actor.profile_path
          ? `${TMDB_IMAGE_BASE}${actor.profile_path}`
          : null,
      })),

      crew: (credits.crew as CrewType[]) || [],
    };

    const more = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recommendations: (recommendations.results || []).map((item: any): RecommendationType => ({
        id: item.id,
        title_ar: item.title || item.name || "بدون عنوان",
        title_en: item.original_title || item.original_name || "",
        original_language: item.original_language,
        overview: item.overview || "",
        genre_ids: item.genre_ids || [],
        backdrop_path: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
        poster_path: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
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
