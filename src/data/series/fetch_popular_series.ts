"use server";
import HandleRequests, { MediaItem } from "@/data/HandleRequests";

export type PopularSeriesItem = MediaItem;

export default async function FetchPopularSeries(page: number = 1): Promise<PopularSeriesItem[]> {
  return await HandleRequests(
    `/trending/tv/week`,
    `&language=ar&page=${page}`
  );
}
