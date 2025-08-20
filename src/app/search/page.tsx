import { notFound } from "next/navigation";
import Head from "next/head";

// App Components
import SearchList from "@/components/shared/searchList";
import Title from "@/components/ui/title";
import Footer from "@/components/shared/footer";


export default async function SearchPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.query?.trim();

  if (!query) return notFound();

  return (
    <>
      <Head>
        <title>{`نتائج البحث عن ${query} | مكتبة موفي`}</title>
        <meta
          name="description"
          content={`استكشف نتائج البحث عن "${query}" في مكتبة موفي، واعرف التقييمات، القصص، والمزيد عن الأفلام والمسلسلات بجودة عالية وبدون إعلانات.`}
        />
        <meta
          name="keywords"
          content={`مكتبة موفي, موفي, Moovy, ${query}, بحث عن ${query}, مشاهدة ${query}, تحميل ${query}, أفضل ${query}, أحدث ${query}, تقييم ${query}, معلومات ${query}, مكتبة أفلام, مكتبة مسلسلات, مشاهدة أفلام, مشاهدة مسلسلات`}
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={`نتائج البحث عن ${query} | مكتبة موفي`} />
        <meta
          property="og:description"
          content={`استكشف نتائج البحث عن "${query}" في مكتبة موفي، واعرف التقييمات، القصص، والمزيد عن الأفلام والمسلسلات بجودة عالية وبدون إعلانات.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://moovy.vercel.app/search?query=${encodeURIComponent(query)}`} />
        <meta property="og:site_name" content="مكتبة موفي" />
        <meta property="og:locale" content="ar_EG" />
        <meta property="og:image" content="https://moovy.vercel.app/images/moovy.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="شعار مكتبة موفي" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`نتائج البحث عن ${query} | مكتبة موفي`} />
        <meta
          name="twitter:description"
          content={`استكشف نتائج البحث عن "${query}" في مكتبة موفي، واعرف التقييمات، القصص، والمزيد عن الأفلام والمسلسلات بجودة عالية وبدون إعلانات.`}
        />
        <meta name="twitter:image" content="https://moovy.vercel.app/images/moovy.webp" />

        {/* Canonical */}
        <link rel="canonical" href={`https://moovy.vercel.app/search?query=${encodeURIComponent(query)}`} />
      </Head>

      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pt-16 md:pt-24 mx-4 md:mx-8 flex flex-col gap-3 md:gap-5">
          <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border-1 rounded-xl">
            <Title className="mb-4">{`نتائج البحث عن : ${query}`}</Title>
            <SearchList query={query} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
