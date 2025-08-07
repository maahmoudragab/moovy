"use server";
import HandleRequests from "@/data/HandleRequests";

export default async function FetchByGenres(genres: number[]) {
  const genreParam = genres.join(",");

  const movies = await HandleRequests(
    "/discover/movie",
    `&with_genres=${genreParam}&language=ar&sort_by=popularity.desc`,
    "فيلم"
  );

  const tv = await HandleRequests(
    "/discover/tv",
    `&with_genres=${genreParam}&language=ar&sort_by=popularity.desc`,
    "مسلسل"
  );

  return [...movies, ...tv].sort(() => Math.random() - 0.5);
}
