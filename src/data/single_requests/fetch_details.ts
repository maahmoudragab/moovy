import { fetchFromTMDB } from "@/lib/tmdb";

export type TMDBDetailsItem = {
    id: number;
    title_ar: string;
    title_en: string;
    original_language: string;
    overview: string;
    genre_ids: number[];
    backdrop_path: string;
    poster_path: string;
    release_date: string;
    type: "فيلم" | "مسلسل";
    vote_average: number;
};

export default async function FetchDetails(
    id: string,
    type: "movie" | "tv"
): Promise<TMDBDetailsItem | null> {
    try {
        const res = await fetchFromTMDB(`/${type}/${id}`, "&language=ar");

        return {
            id: res.id,
            title_ar: res.title || res.name,
            title_en: res.original_title || res.original_name,
            original_language: res.original_language,
            overview: res.overview,
            genre_ids: res.genres.map((g: { id: number }) => g.id),
            backdrop_path: `https://image.tmdb.org/t/p/w1280${res.backdrop_path || res.poster_path}`,
            poster_path: `https://image.tmdb.org/t/p/w780${res.poster_path || res.backdrop_path}`,
            release_date: res.release_date || res.first_air_date,
            type: type === "movie" ? "فيلم" : "مسلسل",
            vote_average: res.vote_average,
        };
    } catch (error) {
        console.error("❌ فشل في جلب تفاصيل العمل:", error);
        return null;
    }
}
