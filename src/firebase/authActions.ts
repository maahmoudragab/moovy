
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup,
  signInWithEmailAndPassword, signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  getAuth
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig';
import type { User } from 'firebase/auth';
import { notFound } from 'next/navigation'
import { updateDoc } from "firebase/firestore";


export const registerWithEmail = async (email: string, password: string) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  return res.user;
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return { user: res.user };
  } catch (err: any) {
    return { error: err.code };
  }
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const res = await signInWithPopup(auth, provider);
  return res.user;
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Logout Error:', err);
  }
};

// Firestore بتخزن بيانات البروفايل بتاع اليوزر في
//  هو الآي دي بتاع المستخدم uid
export const saveUserProfile = async (
  uid: string,
  data: {
    uid: string;
    name: string;
    birthdate: string;
    avatar: string;
    favoriteGenres: string[];
    email: string;
    provider: string;
    isEmailVerified: boolean;
    createdAt: string;
  }
) => {
  await setDoc(doc(db, 'users', uid), data);
};

// بتجيب بيانات البروفايل من Firestore باستخدام uid.
export const getUserProfile = async (uid: string) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user);
    });
  });
};

export const resetPassword = async (email: string) => {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Reset password error:", error);
    return { success: false, error: error.code }; // ← مهم جدًا ترجع error.code
  }
};

export const redirectIfLoggedIn = () => {
  const unsub = onAuthStateChanged(auth, (user) => {
    if (user) {
      notFound()
    }
  });
  return unsub;
};




// تحديث بيانات البروفايل
export const updateUserProfile = async (uid: string, newData: Partial<{
  name: string;
  birthdate: string;
  avatar: string;
}>) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, newData);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Update profile error:", error);
    return { success: false, error: error.code };
  }
};
