"use server";
import { fetchFromTMDB } from "@/lib/tmdb";
import getGenreNames from "@/data/local_functions/genres";

export interface MediaItem {
  id: number;
  title_ar: string;
  title_en: string;
  original_language: string;
  overview: string;
  genre_ids: number[];
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  type: string;
  vote_average: number;
  [key: string]: any;
}

export default async function HandleRequests(path: string, query: string): Promise<MediaItem[]> {
  const res = await fetchFromTMDB(path, query);
  const data = res.results || res.cast;
  return data.filter((i: { poster_path: string }) => i.poster_path).map((item: MediaItem) => ({
    id: item.id,
    title_ar: item.title || item.name, // movie or series ar name
    title_en: item.original_title || item.original_name, // movie or series en name
    original_language: item.original_language,
    overview: item.overview,
    genre_ids: getGenreNames(item.genre_ids || []),
    backdrop_path: item.backdrop_path || item.poster_path,
    poster_path: item.poster_path || item.backdrop_path,
    release_date: item.release_date || item.first_air_date,
    type: item.media_type === "movie" || item.release_date ? "فيلم" : "مسلسل",
    vote_average: item.vote_average,
  }));
}
