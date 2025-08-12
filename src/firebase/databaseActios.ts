import { arrayUnion, doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { MediaItem } from "@/data/HandleRequests";

export const addToFavorites = async (userId: string, item: MediaItem) => {
  const userRef = doc(db, 'users', userId);

  try {
    await updateDoc(userRef, {
      favorites: arrayUnion(item),
    });
  } catch (err) {
  }
};

export const removeFromFavorites = async (userId: string, itemId: number) => {
  try {
    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const favs = snap.data().favorites || [];
    const updated = favs.filter((item: any) => item.id !== itemId);

    await updateDoc(ref, { favorites: updated });
  } catch (err) {
  }
};

export const checkIsFavorite = async (uid: string, movieId: number): Promise<boolean> => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      return false;
    }

    const userData = userSnap.data();
    const favorites = userData.favorites || [];

    const isFav = favorites.some((fav: any) => fav.id === movieId);
    return isFav;
  } catch (error) {
    return false;
  }
};

export const addToRecentViews = async (userId: string, item: MediaItem) => {
  const userRef = doc(db, "users", userId);

  try {
    await setDoc(
      userRef,
      { recent_views: arrayUnion(item) },
      { merge: true }
    );
  } catch (err) {
  }
};