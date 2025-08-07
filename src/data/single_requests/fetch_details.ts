"use server";
import { fetchFromTMDB } from "@/lib/tmdb";
import { MediaItem } from "@/data/HandleRequests";
import getGenreNames from "@/data/local_functions/genres";
import translateVideoType from "@/data/local_functions/translateVideoType";

export interface FullDetailsType {
  main: MainDetails;
  media: MediaDetails;
  recommendation: MediaItem[];
  reviews: ReviewType[];
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
  belongs_to_collection?: {
    name: string
  };
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
    name: string;
    season_number: number;
    overview?: string;
    air_date?: string;
    episode_count?: number;
  }>;
  genres: {
    id: number;
    name: string
  }[]
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

type ReviewType = {
  author: string;
  content: string;
  created_at: string;
  created_at_formatted?: string;
  author_details: {
    name?: string;
    username?: string;
    avatar_path?: string;
    rating?: number;
  };
};

export default async function FetchFullDetails(
  id: string,
  type: "movie" | "tv"
): Promise<FullDetailsType | null> {
  try {
    const results = await Promise.allSettled([
      fetchFromTMDB(`/${type}/${id}`, "&language=ar"),
      fetchFromTMDB(`/${type}/${id}/images`, ""),
      fetchFromTMDB(`/${type}/${id}/videos`, ""),
      fetchFromTMDB(`/${type}/${id}/credits`, "&language=ar"),
      fetchFromTMDB(`/${type}/${id}/recommendations`, "&language=ar"),
      fetchFromTMDB(`/${type}/${id}/reviews`)
    ]);

    const [main, images, videos, credits, recommendations, reviews] = results.map(
      (res) => (res.status === "fulfilled" ? res.value : null)
    );

    if (!main) return null;

    const mainDetails: MainDetails = {
      ...main,
      backdrop_path: `https://image.tmdb.org/t/p/original${main.backdrop_path}`,
      backdrop_blur_path: `https://image.tmdb.org/t/p/w92${main.backdrop_path}`,
      poster_path: `https://image.tmdb.org/t/p/original${main.poster_path}`,
      type: type === "movie" ? "فيلم" : "مسلسل"
    };

    const media: MediaDetails = {
      images: (images?.backdrops || []).slice(0, 10).map((img: MediaImageType) => ({
        ...img,
        file_path: `https://image.tmdb.org/t/p/w1280${img.file_path}`
      })),
      videos: (videos?.results || []).slice(0, 10).map((video: VideoType): VideoType => ({
        ...video,
        type: translateVideoType(video.type)
      })),
      cast: (credits?.cast || []).slice(0, 20).map((actor: CastType): CastType => ({
        ...actor,
        profile_path: actor.profile_path
      }))
    };

    const recommendation: MediaItem[] = (recommendations?.results || []).map((item: any): MediaItem => ({
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
      vote_average: item.vote_average || 0
    }));

    const reviewList: ReviewType[] = (reviews?.results || []).map((review: any): ReviewType => {
      const avatar = review.author_details?.avatar_path;
      const fixedAvatar = avatar
        ? avatar.startsWith("/https")
          ? avatar.substring(1)
          : `https://image.tmdb.org/t/p/w200${avatar}`
        : "/images/avatars/user.png";

      return {
        author: review.author,
        content: review.content,
        created_at: review.created_at,
        created_at_formatted: review.created_at.split("T")[0],
        author_details: {
          name: review.author_details?.name || "",
          username: review.author_details?.username || "",
          avatar_path: fixedAvatar,
          rating: review.author_details?.rating ?? null
        }
      };
    });

    console.log("تفاصيل العمل:", mainDetails);

    return { main: mainDetails, media, recommendation, reviews: reviewList };
  } catch (err) {
    console.error("❌ فشل في جلب التفاصيل:", err);
    return null;
  }
}
