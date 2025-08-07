"use server";
import HandleRequests from "@/data/HandleRequests";

export default async function FetchLatest(page: number = 1) {
  const movie = await HandleRequests(
    "/movie/now_playing",
    `&language=ar&page=${page}&region=EG`,
    "فيلم"
  );

  const tv = await HandleRequests(
    "/tv/on_the_air",
    `&language=ar&page=${page}&region=EG`,
    "مسلسل"
  );

  return [...movie, ...tv].sort(() => Math.random() - 0.5);
}
