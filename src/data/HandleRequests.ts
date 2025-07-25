import { fetchFromTMDB } from "@/lib/tmdb";
import getGenreNames from "./local_functions/genres";

export interface MediaItem {
  id: number;
  title_ar: string;
  title_en: string;
  original_language: string;
  overview: string;
  genre_ids: string[];
  backdrop_path: string;
  poster_path: string;
  release_date?: string;
  type: "فيلم" | "مسلسل";
  vote_average: number;
}

interface TMDBRawItem {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  original_language: string;
  overview: string;
  genre_ids: number[];
  backdrop_path: string;
  poster_path: string;
  release_date?: string;
  first_air_date: string;
  vote_average: number;
  media_type?: "movie" | "tv";
}

export default async function HandleRequests(
  path: string,
  query: string,
  type?: "فيلم" | "مسلسل",
  print?: boolean
): Promise<MediaItem[]> {
  try {
    const res = await fetchFromTMDB(path, query);
    if (print) console.log(res.results);

    return (res.results as TMDBRawItem[])
      .filter((item) => {
        const mediaType = item.media_type || (type === "فيلم" ? "movie" : "tv");
        return mediaType === "movie" || mediaType === "tv";
      }).map((item) => {
        const mediaType = item.media_type || (type === "فيلم" ? "movie" : "tv");
        const translatedType: "فيلم" | "مسلسل" = mediaType === "movie" ? "فيلم" : "مسلسل";

        return {
          id: item.id,
          title_ar: item.title || item.name || "",
          title_en: item.original_title || item.original_name || "",
          original_language: item.original_language,
          overview: item.overview,
          genre_ids: getGenreNames(item.genre_ids),
          backdrop_path: item.backdrop_path,
          poster_path: item.poster_path,
          release_date: item.release_date || item.first_air_date,
          type: translatedType,
          vote_average: item.vote_average,
        };
      });
  } catch (error) {
    console.error("❌ حصلت مشكلة في جلب البيانات:", error);
    return [];
  }
}
