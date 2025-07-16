
// import HeroSection from "@/components/shared/HeroSection";
import Navbar from "@/components/shared/navbar";
import HeroData from "@/data/trending/fetch_trending";
import HeroSection from "@/components/heroSection";



export default async function Home() {
  const hero_data = await HeroData()

  return (
    <div className="min-h-[200vh] bg-cover bg-center bg-no-repeat">
      <Navbar />
      <HeroSection trending={hero_data} />
    </div>
  );
}
