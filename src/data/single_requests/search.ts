import HandleRequests from "@/data/HandleRequests";

export default async function FetchSearchData(query: string, page: number = 1) {
  if (!query) return [];
  return await HandleRequests(
    "/search/multi",
    `&query=${encodeURIComponent(query)}&language=ar&page=${page}`
  );
}