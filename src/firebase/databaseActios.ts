// firebase/databaseActions.ts

import { arrayRemove, arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { auth } from "./firebaseConfig";
import { getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";


export const addToFavorites = async (mediaId: any) => {
  const user = auth.currentUser;
  if (!user) return console.log('🛑 مش لوجن');

  const userRef = doc(db, 'users', user.uid);

  try {
    await updateDoc(userRef, {
      favorites: arrayUnion(mediaId)
    });
    console.log('✅ اتضاف للمفضلة');
  } catch (err: any) {
    if (err.code === 'not-found') {
      // لو الوثيقة مش موجودة، أنشئها
      await setDoc(userRef, {
        favorites: [mediaId]
      });
      console.log('📄 اتعملت وثيقة جديدة واتضاف فيها الميديا');
    } else {
      console.error('❌ مشكلة في الإضافة:', err);
    }
  }
};

export const removeFromFavorites = async (mediaId: any) => {
  const user = auth.currentUser;
  if (!user) return console.log('🛑 مش لوجن');

  const userRef = doc(db, 'users', user.uid);

  try {
    await updateDoc(userRef, {
      favorites: arrayRemove(mediaId)
    });
    console.log('🗑️ اتشال من المفضلة');
  } catch (err) {
    console.error('❌ مشكلة في الحذف:', err);
  }
};

export const checkIsFavorite = async (uid: string, movieId: number): Promise<boolean> => {
  try {
    const userDocRef = doc(db, "users", uid)
    const userSnap = await getDoc(userDocRef)

    if (!userSnap.exists()) {
      console.warn("📛 المستخدم مش موجود")
      return false
    }

    const userData = userSnap.data()
    const favorites = userData.favorites || []

    const isFav = favorites.some((fav: any) => fav.id === movieId)
    return isFav
  } catch (error) {
    console.error("🔥 حصلت مشكلة في التحقق من الفيفوريت:", error)
    return false
  }
}