import HandleRequest, { MediaItem } from "@/data/HandleRequests";

export type PopularMoviesItem = MediaItem;

export default async function FetchPopularMovies(): Promise<PopularMoviesItem[]> {
  return await HandleRequest(
    "/trending/movie/week",
    "&language=ar",
    "فيلم"
  );
}
