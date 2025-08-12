"use server";
import HandleRequests, { MediaItem } from "@/data/HandleRequests";

export type TurkishMovieItem = MediaItem;

export default async function FetchDiscoverTurkishMovies(page : number = 1): Promise<TurkishMovieItem[]> {
  // Gets the date two years ago from today
  const formattedDate = new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString().split("T")[0];

  return await HandleRequests(
    "/discover/movie",
    `&language=ar&with_original_language=tr&sort_by=popularity.desc&primary_release_date.gte=${formattedDate}&page=${page}`,  );
}
