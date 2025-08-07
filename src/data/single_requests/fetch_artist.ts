"use server";
import { fetchFromTMDB } from "@/lib/tmdb";
import HandleRequests, { MediaItem } from "../HandleRequests";

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

export type ArtistFullInfo = {
  artist: ArtistDetails;
  movies: MediaItem[];
  tvShows: MediaItem[];
};

const calculateAge = (b: string) => {
  const d = new Date(b), t = new Date();
  let a = t.getFullYear() - d.getFullYear();
  return t.getMonth() < d.getMonth() || (t.getMonth() === d.getMonth() && t.getDate() < d.getDate()) ? --a : a;
};

export default async function FetchActorFullInfo(
  personId: string,
  print?: boolean
): Promise<ArtistFullInfo> {
  try {
    const [infoArtist, movies, tvShows, externalIds] = await Promise.all([
      fetchFromTMDB(`/person/${personId}`, "&language=ar"),
      HandleRequests(`/person/${personId}/movie_credits`, "&language=ar", "فيلم", print),
      HandleRequests(`/person/${personId}/tv_credits`, "&language=ar", "مسلسل", print),
      fetchFromTMDB(`/person/${personId}/external_ids`) // الريكويست الجديد
    ]);

    if (!infoArtist) throw new Error("مفيش داتا للممثل");

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
      gender: infoArtist.gender === 1 ? "أنثى" : infoArtist.gender === 2 ? "ذكر" : "غير معروف",
      social: {
        instagram: externalIds.instagram_id ? `https://instagram.com/${externalIds.instagram_id}` : undefined,
        twitter: externalIds.twitter_id ? `https://twitter.com/${externalIds.twitter_id}` : undefined,
        facebook: externalIds.facebook_id ? `https://facebook.com/${externalIds.facebook_id}` : undefined,
        tiktok: externalIds.tiktok_id ? `https://www.tiktok.com/@${externalIds.tiktok_id}` : undefined,
        youtube: externalIds.youtube_id ? `https://www.youtube.com/${externalIds.youtube_id}` : undefined,
      }
    };

    return { artist, movies, tvShows };
  } catch (err) {
    console.error("❌ حصلت مشكلة في جلب بيانات الممثل أو أعماله:", err);
    throw err;
  }
}
