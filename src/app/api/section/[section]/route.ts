import { NextRequest, NextResponse } from "next/server";
import { fetchMap } from "@/data/fetchMap";

export async function GET(
  req: NextRequest,
  context: { params: { section: string } }
) {
  const sectionKey = context.params.section;
  const section = fetchMap[sectionKey];

  if (!section) {
    return NextResponse.json([], { status: 404 });
  }

  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);

  const data = await section.fn(page);
  return NextResponse.json(data);
}
