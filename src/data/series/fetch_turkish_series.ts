"use server";
import HandleRequests, { MediaItem } from "@/data/HandleRequests";

export type TurkishSeriesItem = MediaItem;

export default async function FetchDiscoverTurkishSeries(page : number = 1): Promise<TurkishSeriesItem[]> {
  // Gets the date two years ago from today
  const formattedDate = new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString().split("T")[0];

  return await HandleRequests(
    "/discover/tv",
    `&with_original_language=tr&sort_by=popularity.desc&first_air_date.gte=${formattedDate}&page=${page}`
  );
}