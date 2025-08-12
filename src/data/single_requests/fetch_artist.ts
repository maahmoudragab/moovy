"use server";
import { fetchFromTMDB } from "@/lib/tmdb";
import HandleRequests, { MediaItem } from "@/data/HandleRequests";
import { notFound } from "next/navigation";

export type ArtistFullInfo = {
  artist: ArtistDetails;
  movies: MediaItem[];
  tvShows: MediaItem[];
};

export interface ArtistDetails {
  id: number;
  name: string;
  biography: string;
  profile_path: string;
  birthday: string;
  place_of_birth: string;
  known_for_department: string;
  gender: string;
  popularity: number;
  age: number;
  social?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
}

// Calculate age from birthday string
const calculateAge = (birthDate: string) => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  // Adjust if birthday hasn't occurred yet this year
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age;
};

export default async function FetchActorFullInfo(personId: string): Promise<ArtistFullInfo> {
  // Fetch artist info, social IDs, movie and tv credits in parallel
  const results = await Promise.allSettled([
    fetchFromTMDB(`/person/${personId}`, "&language=ar"),
    fetchFromTMDB(`/person/${personId}/external_ids`),
    HandleRequests(`/person/${personId}/movie_credits`, "&language=ar"),
    HandleRequests(`/person/${personId}/tv_credits`, "&language=ar"),
  ]);

  // Extract results or null if failed
  const [infoArtist, externalIds, movies, tvShows] = results.map((res) =>
    res.status === "fulfilled" ? res.value : null
  );

  if (!infoArtist) notFound(); // Return 404 if no artist data

  // Build artist details object
  const artist: ArtistDetails = {
    id: infoArtist.id,
    name: infoArtist.name,
    biography: infoArtist.biography,
    profile_path: infoArtist.profile_path,
    birthday: infoArtist.birthday,
    place_of_birth: infoArtist.place_of_birth,
    known_for_department: infoArtist.known_for_department,
    popularity: infoArtist.popularity,
    age: calculateAge(infoArtist.birthday),
    gender:
      infoArtist.gender === 1
        ? "أنثى"
        : infoArtist.gender === 2
          ? "ذكر"
          : "غير معروف",
    social: {
      instagram: externalIds?.instagram_id
        ? `https://instagram.com/${externalIds.instagram_id}`
        : undefined,
      twitter: externalIds?.twitter_id
        ? `https://twitter.com/${externalIds.twitter_id}`
        : undefined,
      facebook: externalIds?.facebook_id
        ? `https://facebook.com/${externalIds.facebook_id}`
        : undefined,
      tiktok: externalIds?.tiktok_id
        ? `https://www.tiktok.com/@${externalIds.tiktok_id}`
        : undefined,
      youtube: externalIds?.youtube_id
        ? `https://www.youtube.com/${externalIds.youtube_id}`
        : undefined,
    },
  };

  // Return the artist info with movies and TV shows
  return { artist, movies, tvShows };
}
