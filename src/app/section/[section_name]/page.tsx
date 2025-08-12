// Next
import { notFound } from "next/navigation";

// UI Components
import Navbar from "@/components/shared/navbar";
import SectionList from "@/components/shared/sectionList";
import Title from "@/components/ui/title";

import ScrollSmoothWrapper from "@/components/ScrollSmoothWrapper";
import Footer from "@/components/shared/footer";
const validTypes = [
  "kr_movies", "popular_movies", "arabic_movies", "turkish_movies", "anime_movies",
  "kr_series", "popular_series", "arabic_series", "turkish_series", "anime_series",
  "latest"
];
const sectionTitles: Record<string, string> = {
  "latest": "الأحدث",
  "popular_movies": "الأفلام الرائجة",
  "arabic_movies": "أفلام عربية",
  "turkish_movies": "أفلام تركية",
  "anime_movies": "أفلام أنمي",
  "kr_movies": "أفلام كورية",
  "popular_series": "المسلسلات الرائجة",
  "arabic_series": "مسلسلات عربية",
  "turkish_series": "مسلسلات تركية",
  "anime_series": "مسلسلات أنمي",
  "kr_series": "مسلسلات كورية"
};

export default async function SectionPage({ params }: { params: Promise<{ section_name: string }> }) {
  const { section_name } = await params;

  if (!validTypes.includes(section_name)) return notFound();

  return (
    <>
      <Navbar />
      <ScrollSmoothWrapper>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 pt-16 md:pt-24 mx-4 md:mx-8 flex flex-col gap-3 md:gap-5">
            <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
              <Title className="mb-4">{sectionTitles[section_name]}</Title>
              <SectionList section={section_name} />
            </div>
          </main>
          <Footer />
        </div>
      </ScrollSmoothWrapper>
    </>
  );
}
