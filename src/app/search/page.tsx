// Next
import { notFound } from "next/navigation";

// App Components
import Navbar from "@/components/shared/navbar";
import SearchList from "@/components/shared/searchList";
import Title from "@/components/ui/title";

import ScrollSmoothWrapper from "@/components/ScrollSmoothWrapper";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams.query?.trim()

  if (!query) return notFound();

  return (
    <>
      <Navbar queryS={query}/>
      <ScrollSmoothWrapper>
        <main className="pt-16 md:pt-24 mx-4 md:mx-8 flex flex-col gap-3 md:gap-5">
          <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
            <Title className="mb-4">{`نتائج البحث عن : ${query}`}</Title>
            <SearchList query={query} />
          </div>
        </main>
      </ScrollSmoothWrapper>
    </>
  );
}
