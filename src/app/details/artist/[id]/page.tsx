import Head from "next/head";
import FetchArtist from "@/data/single_requests/fetch_artist";
import Artist from "@/components/artist";
import Image from "next/image";
import Footer from "@/components/shared/footer";


export default async function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await FetchArtist(id);

  return (
    <>
      <Head>
        <title>{`${data.artist.name} | مكتبة موفي`}</title>
        <meta
          name="description"
          content={`معلومات شاملة عن ${data.artist.name}، السيرة الذاتية، الأفلام، المسلسلات، الجوائز، وصور الفنان. اكتشف كل ما تريد معرفته عن ${data.artist.name} بالعربي.`}
        />
        <meta
          name="keywords"
          content={`${data.artist.name}, ممثل, ممثلة, سيرة ذاتية, أعمال, أفلام, مسلسلات, جوائز, مكتبة موفي, صور ${data.artist.name}, أعمال ${data.artist.name}`}
        />
        <meta property="og:title" content={`${data.artist.name} | مكتبة موفي`} />
        <meta
          property="og:description"
          content={`اعرف كل حاجة عن ${data.artist.name} من السيرة الذاتية لحد قائمة الأعمال والجوائز في مكتبة موفي.`}
        />
        <meta
          property="og:image"
          content={`https://image.tmdb.org/t/p/w500${data.artist.profile_path}`}
        />
        <meta property="og:type" content="profile" />
        <meta property="og:locale" content="ar_AR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${data.artist.name} | مكتبة موفي`} />
        <meta
          name="twitter:description"
          content={`اكتشف سيرة ${data.artist.name} وأعماله وصوره على مكتبة موفي.`}
        />
        <meta
          name="twitter:image"
          content={`https://image.tmdb.org/t/p/w500${data.artist.profile_path}`}
        />
      </Head>

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
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[120px]" />
          </div>

          <main className="flex-1 w-full pt-16 md:pt-28 px-4 md:px-8 relative z-10">
            <Artist data={data} />
          </main>
          <Footer />
        </div>
    </>
  );
}
