"use server";
import HandleRequest, { MediaItem } from "@/data/HandleRequests";

export type PopularMoviesItem = MediaItem;

export default async function FetchPopularMovies(page: number = 1): Promise<PopularMoviesItem[]> {
  return await HandleRequest(
    `/trending/movie/week`,
    `&language=ar&page=${page}`
  );
}
