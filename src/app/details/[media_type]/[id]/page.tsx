import { notFound } from "next/navigation";
import FetchDetails from "@/data/single_requests/fetch_details";
import DetailsContent from "@/components/details";

export default async function MediaDetailsPage({ params }: { params: Promise<{ id: string; media_type: string }> }) {
  const { id, media_type } = await params;

  if (media_type !== "movie" && media_type !== "tv") return notFound();

  const data = await FetchDetails(id, media_type as "movie" | "tv");

  if (!data) return notFound();

  return <DetailsContent item={data} />;
}
