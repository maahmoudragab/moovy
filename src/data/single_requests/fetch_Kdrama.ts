import HandleRequests, { MediaItem } from "@/data/HandleRequests";

export default async function FetchKdrama(page: number = 1): Promise<MediaItem[]> {
  const formattedDate = new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString().split("T")[0];

  const seriesParams = `&language=ar&with_original_language=ko&sort_by=popularity.desc&vote_count.gte=50&first_air_date.gte=${formattedDate}&page=${page}`;
  const movieParams = `&language=ar&with_original_language=ko&sort_by=popularity.desc&vote_count.gte=50&primary_release_date.gte=${formattedDate}&page=${page}`;

  const [series, movies] = await Promise.all([
    HandleRequests("/discover/tv", seriesParams, "مسلسل"),
    HandleRequests("/discover/movie", movieParams, "فيلم"),
  ]);

  const all = [...series, ...movies];

  // فلترة العناصر المتكررة باستخدام id+type كمفتاح فريد
  const uniqueItems = Array.from(
    new Map(all.map((item) => [`${item.id}-${item.type}`, item])).values()
  );

  return uniqueItems.sort(() => Math.random() - 0.5);
}
