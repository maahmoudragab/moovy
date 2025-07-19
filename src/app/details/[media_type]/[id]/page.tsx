import Navbar from "@/components/shared/navbar";
// import Footer from "@/components/shared/footer";

import FetchDetails from "@/data/single_requests/fetch_details";
import DetailsContent from "@/components/details";

interface params {
    params: { id: string; media_type: "movie" | "tv" }
}

export default async function MediaDetailsPage({ params }: params) {
    const item = await FetchDetails(params.id, params.media_type);
    return (
        <main className="flex flex-col pb-20">
            <Navbar />
            <DetailsContent item={item!} />
            {/* <Footer /> */}
        </main>
    );
}
