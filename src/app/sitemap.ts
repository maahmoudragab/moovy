// app/sitemap.ts
import { MetadataRoute } from "next";

// استيراد الدوال اللي بتجيب البيانات
import fetchArabicMovies from "@/data/movies/fetch_arabic_movies";
import fetchPopularMovies from "@/data/movies/fetch_popular_movies";
import fetchTurkishMovies from "@/data/movies/fetch_turkish_movies";
import fetchKrMovies from "@/data/movies/fetch_kr_movie";
import fetchAnimeMovies from "@/data/movies/fetch_anime_movie";

import fetchArabicSeries from "@/data/series/fetch_arabic_series";
import fetchPopularSeries from "@/data/series/fetch_popular_series";
import fetchTurkishSeries from "@/data/series/fetch_turkish_series";
import fetchKrSeries from "@/data/series/fetch_kr_series";
import fetchAnimeSeries from "@/data/series/fetch_anime_series";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://moovy-hub.vercel.app";

  const [
    arabicMovies,
    popularMovies,
    turkishMovies,
    krMovies,
    animeMovies,
    arabicSeries,
    popularSeries,
    turkishSeries,
    krSeries,
    animeSeries
  ] = await Promise.all([
    fetchArabicMovies(),
    fetchPopularMovies(),
    fetchTurkishMovies(),
    fetchKrMovies(),
    fetchAnimeMovies(),
    fetchArabicSeries(),
    fetchPopularSeries(),
    fetchTurkishSeries(),
    fetchKrSeries(),
    fetchAnimeSeries()
  ]);

  // جمع الكل في مصفوفة واحدة
  const allItems = [
    ...arabicMovies,
    ...popularMovies,
    ...turkishMovies,
    ...krMovies,
    ...animeMovies,
    ...arabicSeries,
    ...popularSeries,
    ...turkishSeries,
    ...krSeries,
    ...animeSeries
  ];

  // إزالة التكرارات بناءً على الـ ID + النوع
  const uniqueItems = Array.from(
    new Map(allItems.map(item => [`${item.id}-${item.type || item.media_type}`, item])).values()
  );

  // تحويل الداتا لروابط
  const urls: MetadataRoute.Sitemap = uniqueItems.map((item: any) => {
    // تحديد النوع بالإنجليزي
    const type =
      item.type === "فيلم"
        ? "movie"
        : item.type === "مسلسل"
        ? "series"
        : item.media_type || (item.title ? "movie" : "series");

    // تحديد آخر تعديل
    const lastModified =
      item.updated_at ||
      item.release_date ||
      item.first_air_date ||
      new Date().toISOString();

    return {
      url: `${baseUrl}/details/${type}/${item.id}`,
      lastModified: new Date(lastModified).toISOString(),
      changeFrequency: "weekly",
      priority: 0.8
    };
  });

  // إضافة الصفحة الرئيسية
  urls.push({
    url: baseUrl,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: 1
  });

  return urls;
}
