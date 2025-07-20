import HandleRequests from "@/data/HandleRequests";

export default async function FetchTrending() {
  const data = await HandleRequests(
    "/trending/movie/day",
    "&language=ar",
    "فيلم"
  );
  return data.slice(0, 9);
}

