// Components
import Navbar from "@/components/shared/navbar";
import HeroSection from "@/components/heroSection";
import SectionSlider from "@/components/mediaSlider";
import SmoothWrapper from "@/components/SmoothWrapper";
// Single Requests
import FetchTrending from "@/data/single_requests/fetch_trending";
import FetchUpcoming from "@/data/single_requests/fetch_upcoming";
import FetchKdrama from "@/data/single_requests/fetch_Kdrama";

// Movie Data
import FetchPopularMovies from "@/data/movies/fetch_popular_movies";
import FetchArabicMovies from "@/data/movies/fetch_arabic_movies";
import FetchPopularTurkishMovies from "@/data/movies/fetch_turkish_movies";
import FetchAnimeMovie from "@/data/movies/fetch_anime_movie";

// Series Data
import FetchPopularSeries from "@/data/series/fetch_popular_series";
import FetchArabicSeries from "@/data/series/fetch_arabic_series";
import FetchPopularTurkishSeries from "@/data/series/fetch_turkish_series";
import FetchAnimeSeries from "@/data/series/fetch_anime_series";
import { Suspense } from "react";


export default async function Home() {
  const [hero_data, popular_movies, arabic_movies, turkish_movies, anime_movies,
    popular_series, arabic_series, turkish_series, anime_series, upcoming, kdrama] = await Promise.all([
      FetchTrending(), ...(await Promise.all([FetchPopularMovies(), FetchArabicMovies(), FetchPopularTurkishMovies(), FetchAnimeMovie(),
      FetchPopularSeries(), FetchArabicSeries(), FetchPopularTurkishSeries(), FetchAnimeSeries(), FetchUpcoming(), FetchKdrama()
      ])).map(items => items.slice(0, 12))]);

  return (
    <>
      <Navbar />
      <main >
        <SmoothWrapper>
          <HeroSection data={hero_data} />

          <div className="mx-4 md:mx-8 flex flex-col gap-3 md:gap-6">
            <div data-lag="1.1" className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
              <Suspense>
                <SectionSlider path="popular-movies" title="الأفلام الرائجة" data={popular_movies} />
              </Suspense>
            </div>
            <div data-lag="1.1" className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
              <Suspense>
                <SectionSlider path="popular-series" title="المسلسلات الرائجة" data={popular_series} />
              </Suspense>
            </div>
            <div data-lag="1.1" className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
              <Suspense>
                <SectionSlider path="arabic-movies" title="افلام عربية" data={arabic_movies} />
              </Suspense>
            </div>
            <div data-lag="1.1" className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
              <Suspense>
                <SectionSlider path="arabic-series" title="مسلسلات عربية" data={arabic_series} />
              </Suspense>
            </div>
            <div data-lag="1.1" className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
              <Suspense>
                <SectionSlider path="turkish-movies" title="أفلام تركية" data={turkish_movies} />
              </Suspense>
            </div>
            <div data-lag="1.1" className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
              <Suspense>
                <SectionSlider path="turkish-series" title="مسلسلات تركية" data={turkish_series} />
              </Suspense>
            </div>
            <div data-lag="1.1" className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
              <Suspense>
                <SectionSlider path="anime-movies" title="أفلام أنمي" data={anime_movies} />
              </Suspense>
            </div>
            <div data-lag="1.1" className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
              <Suspense>
                <SectionSlider path="anime-series" title="مسلسلات أنمي" data={anime_series} />
              </Suspense>
            </div>
            <div data-lag="1.1" className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
              <Suspense>
                <SectionSlider path="kdrama" title="الكيدراما" data={kdrama} />
              </Suspense>
            </div>
            {upcoming.length >= 2 && (

              <div data-lag="1.1" className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
              <Suspense>
                <SectionSlider path="" title="الأعمال القادمة" data={upcoming} />
              </Suspense>
            </div>
            )}

          </div>
        </SmoothWrapper>
      </main>
    </>

  );
}


