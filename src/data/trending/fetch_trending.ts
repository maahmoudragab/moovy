import { fetchFromTMDB } from "@/lib/tmdb";
import getGenreNames from "../local_functions/genres"; 

export interface TMDBMovieItem {
  id: number;
  title_ar: string;
  title_en: string;
  original_language: string;
  overview: string;
  genre_ids: number[];
  backdrop_path: string;
  release_date?: number;
  type: string;
  vote_average: number;
}

export default async function HeroData(): Promise<TMDBMovieItem[] > {
  try {
    const res = await fetchFromTMDB("/trending/movie/day", "language=ar-EG");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: TMDBMovieItem[] = res.results.slice(0, 8).map((item: any) => ({
      id: item.id,
      title_ar: item.title, title_en: item.original_title,
      original_language: item.original_language,
      overview: item.overview, genre_ids: getGenreNames(item.genre_ids),
      backdrop_path: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
      release_date: new Date(item.release_date).getFullYear(),
      type: item.media_type === "tv" ? "مسلسل" : "فيلم",
      vote_average: item.vote_average,
    }));

    console.log(data);

    return data;
  } catch (error) {
    console.error("❌ حصلت مشكلة في جلب البيانات:", error);
    return [];
  }
}
