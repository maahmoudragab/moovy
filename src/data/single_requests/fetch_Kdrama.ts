import HandleRequests, { MediaItem } from "@/data/HandleRequests";

export default async function FetchKdrama(): Promise<MediaItem[]> {
  // Gets the date two years ago from today
  const formattedDate = new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString().split("T")[0];

  const seriesParams = `&language=ar&with_original_language=ko&sort_by=popularity.desc&vote_count.gte=50&first_air_date.gte=${formattedDate}`;
  const movieParams = `&language=ar&with_original_language=ko&sort_by=popularity.desc&vote_count.gte=50&primary_release_date.gte=${formattedDate}`;

  const [series, movies] = await Promise.all([
    HandleRequests("/discover/tv", seriesParams, "مسلسل"),
    HandleRequests("/discover/movie", movieParams, "فيلم"),
  ]);

  return [...series, ...movies].sort(() => Math.random() - 0.5);
}
