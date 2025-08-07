"use server";
import HandleRequests from "@/data/HandleRequests";

export default async function FetchTrending() {
  const data = await HandleRequests(
    "/trending/all/week",
    `&language=ar`  );
  return data;
}

