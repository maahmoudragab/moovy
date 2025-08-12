"use server";
import HandleRequests, { MediaItem } from "@/data/HandleRequests";

export type AnimeMovieItem = MediaItem;

export default async function FetchAnimeMovie(page: number = 1): Promise<AnimeMovieItem[]> {
  return await HandleRequests(
    "/discover/movie",
    `&with_genres=16&language=ar&sort_by=popularity.desc&page=${page}`,
  );
}
