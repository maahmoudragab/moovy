import { NextResponse } from "next/server";
import { fetchMap } from "@/data/fetchMap";

export async function GET(req: Request, { params }: { params: { section: string } }) {
  const section = fetchMap[params.section];
  if (!section) return NextResponse.json([], { status: 404 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");

  const data = await section.fn(page);
  return NextResponse.json(data);
}
