"use server";
import HandleRequests, { MediaItem } from "@/data/HandleRequests";

export type ArabicSeriesItem = MediaItem;

export default async function FetchArabicSeries(page: number = 1): Promise<ArabicSeriesItem[]> {
  const formattedDate = new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString().split("T")[0];

  return await HandleRequests(
    "/discover/tv",
    `&language=ar&with_original_language=ar&with_origin_country=EG&sort_by=popularity.desc&first_air_date.gte=${formattedDate}&page=${page}`,
  );
}
