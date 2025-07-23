// Components
import Navbar from "@/components/shared/navbar";
import HeroSection from "@/components/heroSection";
import SectionSlider from "@/components/MainSlider";

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
  const [hero_data, popular_movies, arabic_movies, turkish_movies, anime_movies,
    popular_series, arabic_series, turkish_series, anime_series, upcoming, kdrama]
    = await Promise.all([FetchTrending(), FetchPopularMovies(), FetchArabicMovies(), FetchPopularTurkishMovies(), FetchAnimeMovie(),
    FetchPopularSeries(), FetchArabicSeries(), FetchPopularTurkishSeries(), FetchAnimeSeries(), FetchUpcoming(), FetchKdrama()]);

  return (
    <main className="flex flex-col gap-5 md:gap-10">
      <Navbar />
      <HeroSection data={hero_data} />
      <div className="mx-4 md:mx-8 flex flex-col gap-3 md:gap-6">
        <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
          <SectionSlider title="الأفلام الرائجة" data={popular_movies} />
        </div>

        <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
          <SectionSlider title="المسلسلات الرائجة" data={popular_series} />
        </div>

        <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
          <SectionSlider title="افلام عربية" data={arabic_movies} />
        </div>

        <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
          <SectionSlider title="مسلسلات عربية" data={arabic_series} />
        </div>

        <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
          <SectionSlider title="افلام تركي" data={turkish_movies} />
        </div>

        <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
          <SectionSlider title="مسلسلات تركي" data={turkish_series} />
        </div>

        <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
          <SectionSlider title="افلام انمي" data={anime_movies} />
        </div>

        <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
          <SectionSlider title="مسلسلات انمي" data={anime_series} />
        </div>

        <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
          <SectionSlider title="الكيدراما" data={kdrama} />
        </div>

        <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
          <SectionSlider title="الأعمال القادمة" data={upcoming} />
        </div>

      </div>
    </main>
  );
}


