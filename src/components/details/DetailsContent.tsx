"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MediaItem } from "@/data/HandleRequests";
import { FullDetailsType } from "@/data/single_requests/fetch_details";

// UI Components
import { toast } from "sonner";
import InfoSection from "@/components/details/InfoSection";
import CastSection from "@/components/details/CastSection";
import SeasonsSection from "@/components/details/SeasonsSection";
import MediaSection from "@/components/details/MediaSection";
import ReviewsSection from "@/components/details/ReviewsSection";
import RecommendationSection from "@/components/details/RecommendationSection";

// Icons
import { CheckCircle, XCircle } from "lucide-react";

// Firebase
import { addToFavorites, removeFromFavorites, checkIsFavorite, addToRecentViews } from "@/firebase/databaseActios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Footer from "../shared/footer";

export default function DetailsContent({ item }: { item: FullDetailsType }) {
  const { main, media, recommendation, reviews } = item;
  const [isMobile, setIsMobile] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Detect if device is mobile based on window width
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        // Prepare the media item for favorites & recent views
        const mediaItem: MediaItem = {
          id: main.id,
          title_ar:
            [main.title_ar, main.title, main.original_title, main.name].find(
              (v) => typeof v === "string"
            ) || "",
          title_en:
            [main.original_title, main.name].find((v) => typeof v === "string") ||
            "",
          original_language: main.original_language || "",
          overview: main.overview || "",
          genre_ids: (main.genres || []).map((g) => g.name),
          backdrop_path: main.backdrop_path || "",
          poster_path: main.poster_path || "",
          release_date: main.release_date || main.first_air_date || "",
          type: main.type,
          vote_average: main.vote_average || 0,
        } as unknown as MediaItem;

        // Check if this item is already in user's favorites
        const isFav = await checkIsFavorite(user.uid, mediaItem.id);
        setIsFavorite(isFav);

        // Add this item to recent views
        await addToRecentViews(user.uid, mediaItem);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [main]);

  // Toggle favorite status on click
  const toggleFavorite = async () => {
    if (!user) return router.push(`/auth/login`); // Redirect if not logged in

    setIsLoading(true);

    const favoriteItem: MediaItem = {
      id: main.id,
      title_ar:
        [main.title_ar, main.title, main.original_title, main.name].find(
          (v) => typeof v === "string"
        ) || "",
      title_en:
        [main.original_title, main.name].find((v) => typeof v === "string") || "",
      original_language: main.original_language || "",
      overview: main.overview || "",
      genre_ids: (main.genres || []).map((g) => g.name),
      backdrop_path: main.backdrop_path || "",
      poster_path: main.poster_path || "",
      release_date: main.release_date || main.first_air_date || "",
      type: main.type,
      vote_average: main.vote_average || 0,
    } as unknown as MediaItem;

    if (isFavorite) {
      // Remove from favorites
      await removeFromFavorites(user.uid, favoriteItem.id);
      setIsFavorite(false);

      toast.success("تمت الإزالة من المفضلة", {
        icon: <XCircle size={22} />,
        duration: 2000,
        style: {
          backgroundColor: "rgba(255, 77, 77, 0.1)",
          backdropFilter: "blur(20px)",
          border: "1.5px solid #ff4d4d44",
          padding: "10px 15px",
          color: "#ff4d4d",
          fontSize: "17px",
          borderRadius: "72px",
          boxShadow: "0 0 20px #ff4d4d44",
        },
      });
    } else {
      // Add to favorites
      await addToFavorites(user.uid, favoriteItem);
      setIsFavorite(true);

      toast.success("تمت الإضافة إلى المفضلة", {
        duration: 2000,
        icon: <CheckCircle size={22} />,
        style: {
          backgroundColor: "rgba(0, 255, 106, 0.1)",
          backdropFilter: "blur(25px)",
          border: "1.5px solid #00ff6a24",
          padding: "10px 15px",
          color: "#6bffa9",
          fontSize: "17px",
          borderRadius: "72px",
          boxShadow: "0 0 24px #00ff6a24",
          userSelect: "none",
        },
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative z-0">

      <div className="absolute inset-0 -z-10">
        {(media.images?.[0]?.file_path || main.backdrop_blur_path) && (
          <Image
            src={`https://image.tmdb.org/t/p/w500${media.images?.[0]?.file_path || main.backdrop_blur_path
              }`}
            alt={main.name || main.title || "صورة"}
            fill
            sizes="100vw"
            priority
            className="object-cover saturate-400"
          />
        )}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl" />
      </div>

      <main className="flex-1 w-full relative z-10">
        {/* Info and favorite button */}
        <InfoSection
          main={main}
          isLoading={isLoading}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />

        {/* Other sections below */}
        <div className="mx-4 md:mx-8 flex flex-col gap-3 md:gap-5">
          <CastSection cast={media.cast} />
          <SeasonsSection seasons={main.seasons} />
          <MediaSection images={media.images} videos={media.videos} isMobile={isMobile} />
          <ReviewsSection reviews={reviews} isMobile={isMobile} />
          <RecommendationSection recommendation={recommendation} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
