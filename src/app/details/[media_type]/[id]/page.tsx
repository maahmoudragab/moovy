import { notFound } from "next/navigation";
import FetchDetails from "@/data/single_requests/fetch_details";
import DetailsContent from "@/components/details";

type Props = {
  params: {
    id: string;
    media_type: "movie" | "tv";
  };
};

export default async function MediaDetailsPage({ params }: Props) {
  const { id, media_type } = params;

  const data = await FetchDetails(id, media_type);

  if (!data) return notFound();

  return <DetailsContent item={data} />;
}
