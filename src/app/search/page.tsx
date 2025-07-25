// app/search/page.tsx
import SearchBody from "@/components/search";
import Navbar from "@/components/shared/navbar";
import SmoothWrapper from "@/components/SmoothWrapper";
import FetchSearchData from "@/data/single_requests/search";

type Props = {
  searchParams: {
    query?: string;
  };
};

export default async function Search({ searchParams }: Props) {
  const query = searchParams.query?.trim() || "";
  const results = await FetchSearchData(query, 1);

  return (
    <SmoothWrapper>
      <Navbar/>
      <main className="relative pt-16 md:pt-28 mx-4 md:mx-8">
        <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">

          <h1 className="text-lg md:text-xl lg:text-2xl font-normal mb-4">نتائج البحث عن : {query}</h1>
          <SearchBody data={results} />
        </div>
      </main>
    </SmoothWrapper>

  );
}
