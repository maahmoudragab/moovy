// Data
import FetchArtist from "@/data/single_requests/fetch_artist";

// App Components
import Artist from "@/components/artist";
import Image from "next/image";
import Navbar from "@/components/shared/navbar";
import ScrollSmoothWrapper from "@/components/ScrollSmoothWrapper";
import Footer from "@/components/shared/footer";

// كومبوننت صفحة التفاصيل - بترجع تفاصيل فيلم أو مسلسل حسب نوعه ومعرّفه
export default async function ArtistPage({ params }: { params: Promise<{ id: string; }> }) {

  const { id } = await params;

  const data = await FetchArtist(id);

  // return <Artist data={data}/>;
  return (

    // <Head>
    //   <title>{data.artist.name || "تفاصيل الفنان - Moovy"}</title>
    //   <meta
    //     name="description"
    //     content={
    //       data.artist.biography ||
    //       "تعرف على تفاصيل الفنان، سيرته الذاتية، وأعماله في الأفلام والمسلسلات."
    //     }
    //   />
    //   <meta
    //     name="keywords"
    //     content={[
    //       data.artist.name,
    //       "Moovy",
    //       "فنان",
    //       "ممثل",
    //       "ممثلين",
    //       "سيرة ذاتية",
    //       data.artist.name || "",
    //     ]
    //       .filter(Boolean)
    //       .join(", ")}
    //   />
    //   <meta httpEquiv="Content-Language" content="ar" />

    //   {/* Open Graph */}
    //   <meta property="og:title" content={data.artist.name || "تفاصيل الفنان - Moovy"} />
    //   <meta property="og:description" content={data.artist.biography || "تعرف على تفاصيل الفنان وأعماله"} />
    //   <meta property="og:url" content="https://moovy-hub.vercel.app" />
    //   <meta property="og:site_name" content="Moovy" />
    //   <meta
    //     property="og:image"
    //     content={
    //       data.artist.profile_path
    //         ? `https://image.tmdb.org/t/p/original${data.artist.profile_path}`
    //         : "https://moovy.vercel.app/images/moovy.png"
    //     }
    //   />
    //   <meta property="og:image:alt" content={data.artist.name || "صورة الفنان"} />
    //   <meta property="og:type" content="profile" />
    //   <meta property="og:locale" content="ar_AR" />

    //   {/* Twitter */}
    //   <meta name="twitter:card" content="summary_large_image" />
    //   <meta name="twitter:title" content={data.artist.name || "تفاصيل الفنان - Moovy"} />
    //   <meta name="twitter:description" content={data.artist.biography || "تعرف على تفاصيل الفنان وأعماله"} />
    //   <meta
    //     name="twitter:image"
    //     content={
    //       data.artist.profile_path
    //         ? `https://image.tmdb.org/t/p/original${data.artist.profile_path}`
    //         : "https://moovy.vercel.app/images/moovy.png"
    //     }
    //   />
    //   <meta name="twitter:creator" content="@MoovyOfficial" />

    //   <meta name="viewport" content="width=device-width, initial-scale=1" />
    //   <meta name="robots" content="index, follow" />
    //   <meta name="author" content="Mahmoud Ragab" />
    //   <meta name="rating" content="General" />
    //   <meta name="theme-color" content="#000000" />
    // </Head>
    <>


      <Navbar />
      <ScrollSmoothWrapper>
        <div className="min-h-screen flex flex-col relative z-0">

      <div className="absolute inset-0 -z-10">
        <Image
          src={`https://image.tmdb.org/t/p/w92${data.artist.profile_path}`}
          alt="خلفية الفنان"
          fill
          sizes="100vw"
          priority
          className="object-cover saturate-150"
        />
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[120px]"
        />
      </div>

          <main className="flex-1 w-full pt-16 md:pt-28 px-4 md:px-8 relative z-10">
            <Artist data={data} />
          </main>

          <Footer />
        </div>
      </ScrollSmoothWrapper>
    </>




  )
}
