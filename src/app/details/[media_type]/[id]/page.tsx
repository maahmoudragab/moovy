// Next
import { notFound } from "next/navigation";

// Data
import FetchDetails from "@/data/single_requests/fetch_details";

// App Components
import DetailsContent from "@/components/details/DetailsContent";
import Navbar from "@/components/shared/navbar";
import ToastComponent from "@/components/shared/ToastComponent";
import Head from "next/head";
import Footer from "@/components/shared/footer";

export default async function MediaDetailsPage({ params }: { params: Promise<{ id: string; media_type: string }> }) {

  const { id, media_type } = await params;

  if (media_type !== "movie" && media_type !== "tv") return notFound();

  const data = await FetchDetails(id, media_type);

  return (
    <>
      <Head>
        <title>{data?.main?.name || data?.main?.title || "Moovy - موسوعة الأفلام والمسلسلات بالعربي"}</title>
        <meta
          name="description"
          content={
            data?.main?.overview ||
            "Moovy هو موسوعة شاملة بتعرض تفاصيل دقيقة عن الأفلام والمسلسلات، من مواعيد العرض، التصنيفات، التقييمات، والملخصات بالعربي."
          }
        />
        <meta name="keywords"
          content={[
            data?.main?.title,
            data?.main?.name,
            data?.main?.overview,
            "Moovy",
            "موفي",
            "موفيز",
            "موفيز بالعربي",
            "موفي بالعربي",
            "موفيز مصر",
            "موفي عربي",
            "موسوعة أفلام",
            "موسوعة مسلسلات",
            "موسوعة الأفلام والمسلسلات",
            "تفاصيل الأفلام",
            "تفاصيل المسلسلات",
            "ملخص أفلام",
            "ملخص المسلسلات",
            "تقييمات أفلام",
            "تقييمات مسلسلات",
            "تقييم أفلام بالعربي",
            "تقييم مسلسلات بالعربي",
            "أفلام بالعربي",
            "مسلسلات بالعربي",
            "بيانات الأفلام",
            "مواعيد عرض الأفلام",
            "مواعيد عرض المسلسلات",
            "تصنيفات الأفلام",
            "تصنيفات المسلسلات",
            "أفضل أفلام",
            "أفضل مسلسلات",
            "مشاهدة الأفلام",
            "مشاهدة المسلسلات",
            "قائمة الأفلام",
            "قائمة المسلسلات",
            "مراجعة أفلام",
            "مراجعة مسلسلات",
            "أخبار الأفلام",
            "أخبار المسلسلات",
            "أفلام جديدة",
            "مسلسلات جديدة",
            "افلام HD",
            "مسلسلات HD",
            "أفلام 2025",
            "مسلسلات 2025",
            "قائمة أفلام عربية",
            "قائمة مسلسلات عربية",
            ...(data?.main?.genres?.map((g: any) => g.name) || []),
          ]
            .filter(Boolean)
            .join(", ")} />
        <meta httpEquiv="Content-Language" content="ar" />

        {/* Open Graph */}
        <meta property="og:title" content={data?.main?.name || data?.main?.title || "Moovy - موسوعة الأفلام والمسلسلات"} />
        <meta property="og:description" content={data?.main?.overview || "Moovy هو موسوعة شاملة بتعرض تفاصيل دقيقة عن الأفلام والمسلسلات"} />
        <meta property="og:url" content="https://moovy-hub.vercel.app" />
        <meta property="og:site_name" content="Moovy" />
        <meta property="og:image"
          content={`https://image.tmdb.org/t/p/w780${data?.main?.backdrop_path || data?.main?.poster_path}`}
        />
        <meta property="og:image:alt" content="Moovy - موسوعة الأفلام والمسلسلات" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_AR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data?.main?.name || data?.main?.title || "Moovy - موسوعة الأفلام والمسلسلات"} />
        <meta name="twitter:description" content={data?.main?.overview || "Moovy هو موسوعة شاملة بتعرض تفاصيل دقيقة عن الأفلام والمسلسلات"} />
        <meta
          name="twitter:image"
          content={`https://image.tmdb.org/t/p/w780${data?.main?.backdrop_path || data?.main?.poster_path}`}
        />
        <meta name="twitter:creator" content="@MoovyOfficial" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Mahmoud Ragab" />
        <meta name="rating" content="General" />
        <meta name="theme-color" content="#000000" />

        {/* Structured data JSON-LD */}
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": data?.main.media_type === "movie" ? "Movie" : "TVSeries",
              name: data?.main?.title || data?.main?.name,
              description: data?.main?.overview,
              image: `https://image.tmdb.org/t/p/w780${data?.main?.poster_path || data?.main?.backdrop_path}`,
              datePublished: data?.main?.release_date || data?.main?.first_air_date,
              genre: data?.main?.genres?.map((g: any) => g.name),
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: data?.main?.vote_average?.toFixed(1),
                ratingCount: data?.main?.vote_count || 0,
              },
            }),
          }} />
      </Head>

      <Navbar />
      <ToastComponent />
      <DetailsContent item={data!} />;

    </>
  )
}
