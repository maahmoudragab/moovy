// Next
import { notFound } from "next/navigation";

// Data
import FetchDetails from "@/data/single_requests/fetch_details";

// App Components
import DetailsContent from "@/components/details/DetailsContent";
import Head from "next/head";

export default async function MediaDetailsPage({ params }: { params: Promise<{ id: string; media_type: string }> }) {

  const { id, media_type } = await params;

  if (media_type !== "movie" && media_type !== "tv") return notFound();

  const data = await FetchDetails(id, media_type);

  return (
    <>
      <Head>
        <title>
          {data?.main?.title || data?.main?.name
            ? `${data.main.title || data.main.name} - Moovy - مكتبة موفي`
            : "Moovy - مكتبة موفي"}
        </title>

        <meta
          name="description"
          content={
            (data?.main?.overview
              ? `${data.main.overview} — مكتبة موفي مكانك لمعرفة كل جديد عن الأفلام والمسلسلات بالعربي.`
              : "مكتبة موفي مكانك لمعرفة كل جديد عن الأفلام والمسلسلات بالعربي.")
          }
        />
        <link
          rel="canonical"
          href={`https://moovy.com/${data?.main.media_type}/${data?.main.id}`}
        />
        <meta
          name="keywords"
          content={[
            // Dynamic content
            data?.main?.title,
            data?.main?.name,
            ...(data?.main?.genres?.map((g: any) => g.name) || []),

            // Branding
            "Moovy",
            "مكتبة موفي",
            "موفي",
            "موفيز",
            "موفي بالعربي",
            "موفيز بالعربي",

            // Movies & Series
            "أفلام",
            "مسلسلات",
            "أفلام مترجمة",
            "مسلسلات مترجمة",
            "مشاهدة أفلام",
            "مشاهدة مسلسلات",
            "تحميل أفلام",
            "تحميل مسلسلات",
            "مشاهدة أفلام جديدة",
            "مشاهدة مسلسلات جديدة",

            // Categories & Genres
            "أفلام أكشن",
            "أفلام كوميدي",
            "أفلام رعب",
            "أفلام رومانسية",
            "أفلام خيال علمي",
            "أفلام دراما",
            "أفلام أنيميشن",
            "أفلام تاريخية",
            "مسلسلات تركية",
            "مسلسلات عربية",
            "مسلسلات أجنبية",
            "مسلسلات كورية",
            "مسلسلات إنمي",

            // Years
            "أفلام 2025",
            "مسلسلات 2025",
            "أفلام 2024",
            "مسلسلات 2024",
            "أحدث الأفلام",
            "أحدث المسلسلات",

            // Common searches
            "أفضل أفلام",
            "أفضل مسلسلات",
            "قائمة أفلام",
            "قائمة مسلسلات",
            "تقييم الأفلام",
            "تقييم المسلسلات",
            "ملخص أفلام",
            "ملخص مسلسلات",
            "أخبار الأفلام",
            "أخبار المسلسلات",
            "أفلام HD",
            "مسلسلات HD",
            "أفلام 4K",
            "مسلسلات 4K",
            "مواعيد عرض الأفلام",
            "مواعيد عرض المسلسلات",
          ]
            .filter(Boolean)
            .join(", ")}
        />

        <meta httpEquiv="Content-Language" content="ar" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content={
            data?.main?.title || data?.main?.name
              ? `${data.main.title || data.main.name} - Moovy - مكتبة موفي`
              : "Moovy - مكتبة موفي"
          }
        />
        <meta
          property="og:description"
          content={
            data?.main?.overview
              ? `${data.main.overview} — مكتبة موفي مكانك لمعرفة كل جديد عن الأفلام والمسلسلات بالعربي.`
              : "مكتبة موفي مكانك لمعرفة كل جديد عن الأفلام والمسلسلات بالعربي."
          }
        />
        <meta
          property="og:image"
          content={`https://image.tmdb.org/t/p/w780${data?.main?.backdrop_path || data?.main?.poster_path
            }`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_AR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={
            data?.main?.title || data?.main?.name
              ? `${data.main.title || data.main.name} - Moovy - مكتبة موفي`
              : "Moovy - مكتبة موفي"
          }
        />
        <meta
          name="twitter:description"
          content={
            data?.main?.overview
              ? `${data.main.overview} — مكتبة موفي مكانك لمعرفة كل جديد عن الأفلام والمسلسلات بالعربي.`
              : "مكتبة موفي مكانك لمعرفة كل جديد عن الأفلام والمسلسلات بالعربي."
          }
        />
        <meta
          name="twitter:image"
          content={`https://image.tmdb.org/t/p/w780${data?.main?.backdrop_path || data?.main?.poster_path
            }`}
        />
        <meta name="twitter:creator" content="@MoovyOfficial" />

        <meta name="robots" content="index, follow" />
        <meta name="author" content="Mahmoud Ragab" />
        <meta name="rating" content="General" />
        <meta name="theme-color" content="#000000" />

        {/* Structured data JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": data?.main.media_type === "movie" ? "Movie" : "TVSeries",
              name: data?.main?.title || data?.main?.name || "Moovy - مكتبة موفي",
              description: data?.main?.overview
                ? `${data.main.overview} — مكتبة موفي مكانك لمعرفة كل جديد عن الأفلام والمسلسلات بالعربي.`
                : "مكتبة موفي مكانك لمعرفة كل جديد عن الأفلام والمسلسلات بالعربي.",
              image: `https://image.tmdb.org/t/p/w780${data?.main?.poster_path || data?.main?.backdrop_path
                }`,
              datePublished:
                data?.main?.release_date || data?.main?.first_air_date,
              genre: data?.main?.genres?.map((g: any) => g.name),
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: data?.main?.vote_average?.toFixed(1),
                ratingCount: data?.main?.vote_count || 0,
              },
            }),
          }}
        />
      </Head>

      <DetailsContent item={data!} />
    </>
  )
}
