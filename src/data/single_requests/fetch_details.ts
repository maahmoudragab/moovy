"use server";
import { fetchFromTMDB } from "@/lib/tmdb";
import { MediaItem } from "@/data/HandleRequests";
import getGenreNames from "@/data/local_functions/genres";
import translateVideoType from "@/data/local_functions/translateVideoType";

export interface FullDetailsType {
  main: MainDetails;
  media: MediaDetails;
  reviews: ReviewType[];
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
  belongs_to_collection?: {
    id?: number;
    name?: string;
    poster_path?: string;
    backdrop_path?: string;
  } | null;
  backdrop_blur_path: string | null;
  poster_path: string | null;
  type: string;
  original_language: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  seasons?: SeasonType[];
  genres: { id: number; name: string }[];
  [key: string]: unknown;
};

type SeasonType = {
  id: number;
  name: string;
  season_number: number;
  overview?: string;
  air_date?: string;
  episode_count?: number;
  episodes?: {
    id: number;
    name: string;
    overview: string;
    runtime?: number;
    still_path?: string;
    air_date?: string;
    episode_number: number;
  }[];
};

type MediaDetails = {
  images: { file_path: string }[];
  videos: VideoType[];
  cast: CastType[];
};

type VideoType = {
  key: string;
  name: string;
  published_at: string;
  type: string;
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
    rating?: number | null;
  };
};

export default async function FetchFullDetails(
  id: string,
  type: "movie" | "tv"
): Promise<FullDetailsType | null> {
  try {
    // Fetch main details, images, videos, credits, recommendations, and reviews
    const results = await Promise.allSettled([
      fetchFromTMDB(`/${type}/${id}`, "&language=ar"),
      fetchFromTMDB(`/${type}/${id}/images`, ""),
      fetchFromTMDB(`/${type}/${id}/videos`, ""),
      fetchFromTMDB(`/${type}/${id}/credits`, "&language=ar"),
      fetchFromTMDB(`/${type}/${id}/recommendations`, "&language=ar"),
      fetchFromTMDB(`/${type}/${id}/reviews`)
    ]);

    // Extract data if successful
    const [main, images, videos, credits, recommendations, reviews] = results.map(
      (res) => (res.status === "fulfilled" ? res.value : null)
    );

    if (!main) return null; // Return null if no main data

    // If TV show, fetch season episodes
    if (main.seasons?.length) {
      const seasonResults = await Promise.allSettled(
        main.seasons.map((season: any) =>
          fetchFromTMDB(`/${type}/${id}/season/${season.season_number}`, "&language=ar")
        )
      );
      main.seasons.forEach((season: any, i: number) => {
        if (seasonResults[i].status === "fulfilled") {
          season.episodes = seasonResults[i].value?.episodes || [];
        }
      });
    }

    // Build main details with full image URLs
    const mainDetails: MainDetails = {
      ...main,
      backdrop_path: main.backdrop_path
        ? `https://image.tmdb.org/t/p/original${main.backdrop_path}`
        : null,
      backdrop_blur_path:
        main.backdrop_path || main.poster_path
          ? `https://image.tmdb.org/t/p/w92${main.backdrop_path || main.poster_path}`
          : null,
      poster_path: main.poster_path
        ? `https://image.tmdb.org/t/p/original${main.poster_path}`
        : null,
      type: type === "movie" ? "فيلم" : "مسلسل"
    };

    // Prepare media details (images, videos, cast)
    const media: MediaDetails = {
      images: (images?.backdrops || [])
        .filter((img: any) => img.file_path)
        .slice(0, 10)
        .map((img: { file_path: string }) => ({
          ...img,
          file_path: `https://image.tmdb.org/t/p/w1280${img.file_path}`
        })),
      videos: (videos?.results || [])
        .filter((video: any) => video.key)
        .slice(0, 10)
        .map((video: VideoType) => ({
          ...video,
          type: translateVideoType(video.type)
        })),
      cast: (credits?.cast || [])
        .slice(0, 20)
        .map((actor: CastType) => ({
          ...actor,
          profile_path: actor.profile_path
            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
            : null
        }))
    };

    // Map recommendations with needed fields
    const recommendation: MediaItem[] = (recommendations?.results || []).map((item: any) => ({
      id: item.id,
      title_ar: item.title || item.name || "بدون عنوان",
      title_en: item.original_title || item.original_name || "",
      genre_ids: getGenreNames(item.genre_ids || []),
      original_language: item.original_language,
      overview: item.overview || "",
      backdrop_path: item.backdrop_path || item.poster_path || null,
      poster_path: item.poster_path || null,
      release_date: item.release_date || item.first_air_date || "",
      type: item.media_type === "tv" || item.first_air_date ? "مسلسل" : "فيلم",
      vote_average: item.vote_average || 0
    }));

    // Prepare reviews, fix avatar URLs and format date
    const reviewList: ReviewType[] = (reviews?.results || []).map((review: any) => {
      let avatar = review.author_details?.avatar_path;
      if (avatar) {
        avatar = avatar.startsWith("/https")
          ? avatar.substring(1)
          : `https://image.tmdb.org/t/p/w200${avatar}`;
      } else {
        avatar = "/images/avatars/user.png"; // default avatar
      }
      return {
        author: review.author,
        content: review.content,
        created_at: review.created_at,
        created_at_formatted: review.created_at?.split("T")[0] || "",
        author_details: {
          name: review.author_details?.name || "",
          username: review.author_details?.username || "",
          avatar_path: avatar,
          rating: review.author_details?.rating ?? null
        }
      };
    });

    return { main: mainDetails, media, recommendation, reviews: reviewList };
  } catch {
    return null; // Return null on any error
  }
}
