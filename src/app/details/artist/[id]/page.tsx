// Data
import FetchArtist from "@/data/single_requests/fetch_artist";

// App Components
import Artist from "@/components/artist";

// كومبوننت صفحة التفاصيل - بترجع تفاصيل فيلم أو مسلسل حسب نوعه ومعرّفه
export default async function ArtistPage({ params }: { params: Promise<{ id: string; }> }) {

  const { id } = await params;

  const data = await FetchArtist(id);

  return <Artist data={data}/>;
}
