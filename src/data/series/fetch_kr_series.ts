"use server";
import HandleRequests, { MediaItem } from "@/data/HandleRequests";

export default async function FetchKrSeries(page: number = 1): Promise<MediaItem[]> {
  const formattedDate = new Date(new Date().setFullYear(new Date().getFullYear() -1)).toISOString().split("T")[0];

  const params = `&language=ar&with_original_language=ko&sort_by=popularity.desc&first_air_date.gte=${formattedDate}&page=${page}`;

  return await HandleRequests("/discover/tv", params);
}
