"use server";
import HandleRequests, { MediaItem } from "@/data/HandleRequests";

export type ArabicMoviesItem = MediaItem;

export default async function FetchArabicMovies(page: number = 1): Promise<ArabicMoviesItem[]> {
  // Gets the date two years ago from today
  const formattedDate = new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString().split("T")[0];

  return await HandleRequests(
    "/discover/movie",
    `&language=ar&with_original_language=ar&with_origin_country=EG&sort_by=popularity.desc&first_air_date.gte=${formattedDate}&page=${page}`,
  );
}
