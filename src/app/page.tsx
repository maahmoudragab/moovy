
// Components
import HeroSection from "@/components/heroSection";
import SectionSlider from "@/components/shared/sectionSlider";
import Footer from "@/components/shared/footer";

// Single Requests
import FetchTrending from "@/data/single_requests/fetch_trending";
import FetchUpcoming from "@/data/single_requests/fetch_upcoming";

// Movie Data
import FetchPopularMovies from "@/data/movies/fetch_popular_movies";
import FetchArabicMovies from "@/data/movies/fetch_arabic_movies";
import FetchPopularTurkishMovies from "@/data/movies/fetch_turkish_movies";
import FetchAnimeMovie from "@/data/movies/fetch_anime_movie";
import FetchKrMovies from "@/data/movies/fetch_kr_movie";

// Series Data
import FetchPopularSeries from "@/data/series/fetch_popular_series";
import FetchArabicSeries from "@/data/series/fetch_arabic_series";
import FetchPopularTurkishSeries from "@/data/series/fetch_turkish_series";
import FetchAnimeSeries from "@/data/series/fetch_anime_series";
import FetchKrSeries from "@/data/series/fetch_kr_series";

export default async function Home() {
  const [hero_data, popular_movies, arabic_movies, turkish_movies, anime_movies, kr_movie,
    popular_series, arabic_series, turkish_series, anime_series, kr_series, upcoming,]
    = (await Promise.all([(await FetchTrending()).slice(0, 9), FetchPopularMovies(), FetchArabicMovies(), FetchPopularTurkishMovies(), FetchAnimeMovie(), FetchKrMovies(),
    FetchPopularSeries(), FetchArabicSeries(), FetchPopularTurkishSeries(), FetchAnimeSeries(), FetchKrSeries(), FetchUpcoming()])).map((arr) => arr.slice(0, 14));

  return (
    <main className="flex flex-col gap-5 md:gap-2">
      <HeroSection data={hero_data} />
      <div className="mx-4 md:mx-8 flex flex-col gap-3 md:gap-5">
        <SectionSlider path="popular_movies" title="الأفلام الرائجة" data={popular_movies} />

        <SectionSlider path="popular_series" title="المسلسلات الرائجة" data={popular_series} />

        <SectionSlider path="arabic_movies" title="أفلام عربية" data={arabic_movies} />

        <SectionSlider path="arabic_series" title="مسلسلات عربية" data={arabic_series} />

        <SectionSlider path="turkish_movies" title="أفلام تركية" data={turkish_movies} />

        <SectionSlider path="turkish_series" title="مسلسلات تركية" data={turkish_series} />

        <SectionSlider path="anime_movies" title="أفلام أنمي" data={anime_movies} />

        <SectionSlider path="anime_series" title="مسلسلات أنمي" data={anime_series} />

        <SectionSlider path="kr_movies" title="أفلام كورية" data={kr_movie} />

        <SectionSlider path="kr_series" title="مسلسلات كورية" data={kr_series} />

        <SectionSlider title="الأعمال القادمة" data={upcoming} />
      </div>
      <Footer />
    </main>
  );
}


