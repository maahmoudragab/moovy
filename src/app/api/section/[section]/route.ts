import { NextResponse } from "next/server"
import { fetchMap } from "@/data/fetchMap"

export async function GET(req: Request, { params }: { params: Promise<{ section: string }> }) {
  // await the params since it's now a Promise in Next.js 15
  const resolvedParams = await params
  const section = fetchMap[resolvedParams.section]

  if (!section) return NextResponse.json([], { status: 404 })

  const { searchParams } = new URL(req.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const data = await section.fn(page)

  return NextResponse.json(data)
}
