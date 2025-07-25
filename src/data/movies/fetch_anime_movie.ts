import HandleRequests, { MediaItem } from "@/data/HandleRequests";

export type AnimeMovieItem = MediaItem;

export default async function FetchAnimeMovie(page: number = 1) {
  return await HandleRequests(
    "/discover/movie",
    `&with_genres=16&language=ar&sort_by=popularity.desc&page=${page}`,
    "فيلم"
  );
}
