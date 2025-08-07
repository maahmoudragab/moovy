import { arrayUnion, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { MediaItem } from "@/data/HandleRequests";

export const addToFavorites = async (userId: string, item: MediaItem) => {
  const userRef = doc(db, 'users', userId);

  try {
    await updateDoc(userRef, {
      favorites: arrayUnion(item),
    });
    console.log('✅ اتحفظ في المفضلة');
  } catch (err) {
    console.error('❌ مشكلة في الإضافة:', err);
  }
};

export const removeFromFavorites = async (userId: string, itemId: number) => {
  try {
    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    console.log("reeeeeeeeeeef", ref)
    console.log("snaaaaaaaaaap", snap)
    if (!snap.exists()) return console.log('❌ المستخدم مش موجود');

    const favs = snap.data().favorites || [];
    const updated = favs.filter((item: any) => item.id !== itemId);

    await updateDoc(ref, { favorites: updated });
    console.log('🗑️ اتشال من المفضلة');
  } catch (err) {
    console.error('❌ مشكلة في الحذف:', err);
  }
};

export const checkIsFavorite = async (uid: string, movieId: number): Promise<boolean> => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      console.warn("📛 المستخدم مش موجود");
      return false;
    }

    const userData = userSnap.data();
    const favorites = userData.favorites || [];

    const isFav = favorites.some((fav: any) => fav.id === movieId);
    return isFav;
  } catch (error) {
    console.error("🔥 حصلت مشكلة في التحقق من الفيفوريت:", error);
    return false;
  }
};
