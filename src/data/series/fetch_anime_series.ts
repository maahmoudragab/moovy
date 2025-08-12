"use server";
import HandleRequests, { MediaItem } from "@/data/HandleRequests";

export type AnimeSeriesItem = MediaItem;

export default async function FetchAnimeSeries(page: number = 1): Promise<AnimeSeriesItem[]> {
  return await HandleRequests(
    "/discover/tv",
    `&with_genres=16&language=ar&sort_by=popularity.desc&page=${page}`,
  );
}
