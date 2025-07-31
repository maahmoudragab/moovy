// Next
import { NextRequest } from "next/server";

// Movie Data
import FetchPopularMovies from "@/data/movies/fetch_popular_movies";
import FetchArabicMovies from "@/data/movies/fetch_arabic_movies";
import FetchPopularTurkishMovies from "@/data/movies/fetch_turkish_movies";
import FetchAnimeMovies from "@/data/movies/fetch_anime_movie";
import FetchKrMovies from "@/data/movies/fetch_kr_movie";

// Series Data
import FetchPopularSeries from "@/data/series/fetch_popular_series";
import FetchArabicSeries from "@/data/series/fetch_arabic_series";
import FetchPopularTurkishSeries from "@/data/series/fetch_turkish_series";
import FetchAnimeSeries from "@/data/series/fetch_anime_series";
import FetchKrSeries from "@/data/series/fetch_kr_series";

import FetchLatest from "@/data/single_requests/fetch_latest";

const fetchMap: Record<string, (page: number) => Promise<unknown>> = {
  'kr_movies': FetchKrMovies,
  'popular_movies': FetchPopularMovies,
  'arabic_movies': FetchArabicMovies,
  'turkish_movies': FetchPopularTurkishMovies,
  'anime_movies': FetchAnimeMovies,
  'kr_series': FetchKrSeries,
  'popular_series': FetchPopularSeries,
  'arabic_series': FetchArabicSeries,
  'turkish_series': FetchPopularTurkishSeries,
  'anime_series': FetchAnimeSeries,
  'latest': FetchLatest,
};

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const type = searchParams.get("type") || '';
  const page = parseInt(searchParams.get("page") || '1');

  const fetchFn = fetchMap[type];
  const data = await fetchFn(page);

  return Response.json(data);
}
