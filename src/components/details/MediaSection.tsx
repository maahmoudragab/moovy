
import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import PaginatedSection from "@/components/shared/paginatedSection";
import { FullDetailsType } from "@/data/single_requests/fetch_details";

export default function MediaSection({ images, videos, isMobile }: {
  images: FullDetailsType["media"]["images"];
  videos: FullDetailsType["media"]["videos"];
  isMobile: boolean
}) {
  const imagesPerPage = 4;
  const [playedVideo, setPlayedVideo] = useState<string | null>(null);
  const [currentImagePage, setCurrentImagePage] = useState(1);
  const [currentVideoPage, setCurrentVideoPage] = useState(1);
  const visibleImages = images.slice((currentImagePage - 1) * imagesPerPage, currentImagePage * imagesPerPage);

  const videos_per_page = isMobile ? 2 : 4;
  const totalImagePages = Math.ceil(images.length / imagesPerPage);
  const totalVideoPages = Math.ceil(videos.length / videos_per_page);
  const visibleVideos = videos.slice((currentVideoPage - 1) * videos_per_page, currentVideoPage * videos_per_page);

  return (
    <>
      {images && images.length > 2 && (
        <PaginatedSection
          title="صور العمل"
          totalPages={totalImagePages}
          currentPage={currentImagePage}
          setCurrentPage={setCurrentImagePage}
        >
          {visibleImages.map((img, index) => (
            <div key={index} className="rounded-lg overflow-hidden border border-white/10 bg-white/5">
              <Image
                src={img.file_path}
                alt={`image-${index}`}
                width={0}
                height={0}
                className="object-cover w-full"
                unoptimized
              />
            </div>
          ))}
        </PaginatedSection>
      )}

      {videos?.length > 0 && (
        <PaginatedSection
          title="فيديوهات العمل"
          totalPages={totalVideoPages}
          currentPage={currentVideoPage}
          setCurrentPage={setCurrentVideoPage}
        >
          {visibleVideos.map((video, index) => {
            const isPlaying = playedVideo === video.key;
            return (
              <div key={index} className="rounded-lg overflow-hidden border border-white/10 bg-white/5">
                {isPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.key}?autoplay=1`}
                    title={video.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    sandbox="allow-same-origin allow-scripts allow-presentation allow-popups allow-popups-to-escape-sandbox"
                    className="w-full aspect-video"
                  />
                ) : (
                  <div
                    onClick={() => setPlayedVideo(video.key)}
                    className="relative w-full aspect-video cursor-pointer"
                  >
                    <Image
                      fill
                      src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                      alt={video.name}
                      unoptimized
                      className="object-cover"
                    />
                    <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 p-2 rounded-full box-content text-white/80" />
                  </div>
                )}
                <div className="flex items-center justify-between gap-2 p-2 text-xs text-white/70" dir="ltr">
                  <p className="text-xs text-white/65 truncate">{video.published_at.split("T")[0]}</p>
                  <h3 className="text-xs text-white/65 truncate">{video.type}</h3>
                </div>
              </div>
            );
          })}
        </PaginatedSection>
      )}
    </>
  );
}