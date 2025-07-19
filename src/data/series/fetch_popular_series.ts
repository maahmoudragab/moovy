import HandleRequests, { MediaItem } from "../HandleRequests";

export type PopularSeriesItem = MediaItem;

export default async function FetchPopularSeries(): Promise<PopularSeriesItem[]> {
  return await HandleRequests(
    "/trending/tv/week",
    "&language=ar",
    "مسلسل");
}
