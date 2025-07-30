"use server";
import HandleRequests from "@/data/HandleRequests";

export default async function FetchSearch(page: number = 1, query: string = "") {
  const data = await HandleRequests(
    "/search/multi",
    `&language=ar&query=${query}&page=${page}`
  );
  return data;
} 

