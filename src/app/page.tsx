// Components
import Navbar from "@/components/shared/navbar";
import HeroSection from "@/components/heroSection";
import SectionSlider from "@/components/sectionSlider";
import Footer from "@/components/shared/footer";

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

export default async function Home() {
  const hero_data = await FetchTrending()

  const popular_movies = await FetchPopularMovies()
  const arabic_movies = await FetchArabicMovies()
  const turkish_movies = await FetchPopularTurkishMovies()
  const anime_movies = await FetchAnimeMovie()


  const popular_series = await FetchPopularSeries()
  const arabic_series = await FetchArabicSeries()
  const turkish_series = await FetchPopularTurkishSeries()
  const anime_series = await FetchAnimeSeries()

  const upcoming = await FetchUpcoming()
  const kdrama = await FetchKdrama()

  return (
    <main className="flex flex-col gap-5 md:gap-10 pb-20">
      <Navbar />

      <HeroSection data={hero_data} />

      <SectionSlider title="الأفلام الرائجة" data={popular_movies} />

      <SectionSlider title="المسلسلات الرائجة" data={popular_series} />

      <SectionSlider title="افلام عربية" data={arabic_movies} />

      <SectionSlider title="مسلسلات عربية" data={arabic_series} />

      <SectionSlider title="افلام تركي" data={turkish_movies} />

      <SectionSlider title="مسلسلات تركي" data={turkish_series} />

      <SectionSlider title="افلام انمي" data={anime_movies} />

      <SectionSlider title="مسلسلات انمي" data={anime_series} />

      <SectionSlider title="الكيدراما" data={kdrama} />

      <SectionSlider title="الأعمال القادمة" data={upcoming} />

      {/* <Footer /> */}
    </main>

  );
}
