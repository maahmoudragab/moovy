import { fetchFromTMDB } from "@/lib/tmdb";
import getGenreNames from "./local_functions/genres";

export interface MediaItem {
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
}

export default async function HandleRequests(path: string, query: string, type: "فيلم" | "مسلسل", print?: boolean): Promise<MediaItem[]> {
  try {
    const res = await fetchFromTMDB(path, query);
    if (print) console.log(res.results);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.results.slice(0, 20).map((item: any) => ({
      id: item.id,
      title_ar: item.title || item.name,
      title_en: item.original_title || item.original_name,
      original_language: item.original_language,
      overview: item.overview,
      genre_ids: getGenreNames(item.genre_ids || []),
      backdrop_path: `https://image.tmdb.org/t/p/original${item.backdrop_path || item.poster_path}`,
      poster_path: `https://image.tmdb.org/t/p/w780${item.poster_path || item.backdrop_path}`,
      release_date: item.release_date || item.first_air_date,
      type,
      vote_average: item.vote_average,
    }));
  } catch (error) {
    console.error("❌ حصلت مشكلة في جلب البيانات:", error);
    return [];
  }
}
