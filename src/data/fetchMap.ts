import { MediaItem } from "@/data/HandleRequests";
import FetchPopularMovies from "@/data/movies/fetch_popular_movies";
import FetchArabicMovies from "@/data/movies/fetch_arabic_movies";
import FetchPopularTurkishMovies from "@/data/movies/fetch_turkish_movies";
import FetchAnimeMovie from "@/data/movies/fetch_anime_movie";
import FetchPopularSeries from "@/data/series/fetch_popular_series";
import FetchArabicSeries from "@/data/series/fetch_arabic_series";
import FetchPopularTurkishSeries from "@/data/series/fetch_turkish_series";
import FetchAnimeSeries from "@/data/series/fetch_anime_series";
import FetchKdrama from "@/data/single_requests/fetch_Kdrama";

export const fetchMap: Record<
  string,
  { title: string; fn: (page?: number) => Promise<MediaItem[]> }
> = {
  "popular-movies": { title: "الأفلام الرائجة", fn: FetchPopularMovies },
  "popular-series": { title: "المسلسلات الرائجة", fn: FetchPopularSeries },
  "arabic-movies": { title: "افلام عربية", fn: FetchArabicMovies },
  "arabic-series": { title: "مسلسلات عربية", fn: FetchArabicSeries },
  "turkish-movies": { title: "أفلام تركية", fn: FetchPopularTurkishMovies },
  "turkish-series": { title: "مسلسلات تركية", fn: FetchPopularTurkishSeries },
  "anime-movies": { title: "أفلام أنمي", fn: FetchAnimeMovie },
  "anime-series": { title: "مسلسلات أنمي", fn: FetchAnimeSeries },
  "kdrama": { title: "الكيدراما", fn: FetchKdrama },
};
