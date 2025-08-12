// Next
import { NextRequest } from "next/server";

// Data
import FetchSearch from "@/data/single_requests/fetch_search";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");

  if (!query) {
    return new Response("Query is required", { status: 400 });
  }

  const data = await FetchSearch(page, query);
  return Response.json(data);
}
