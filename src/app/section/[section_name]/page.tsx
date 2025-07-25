import { notFound } from "next/navigation";
import MediaList from "@/components/sectionItems";
import { fetchMap } from "@/data/fetchMap";
import Navbar from "@/components/shared/navbar";
import SmoothWrapper from "@/components/SmoothWrapper";

export default async function SectionPage({ params }: { params: Promise<{ section_name: string }> }) {
  const { section_name } = await params; // ✅ استنى الـ Promise هنا

  const section = fetchMap[section_name];
  if (!section) return notFound();

  const data = await section.fn(1); // ✅ أول صفحة من الداتا

  return (
    <SmoothWrapper>
      <Navbar />
      <main className="relative pt-16 md:pt-28 mx-4 md:mx-8">
        <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">

          <h1 className="text-lg md:text-xl lg:text-2xl font-normal mb-4">{section.title}</h1>
          <MediaList section={section_name} initialData={data} />
        </div>
      </main>
    </SmoothWrapper>
  );
}
