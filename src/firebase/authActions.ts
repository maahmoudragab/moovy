
// Firebase Auth
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  getAuth,
  sendEmailVerification,
  type User,
} from "firebase/auth"

// Firebase Firestore
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/firebase/firebaseConfig"

// Next.js
import { notFound } from "next/navigation"

export const registerWithEmail = async (email: string, password: string) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  return res.user;
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return { user: res.user };
  } catch (err: any) {
    throw Error(err)
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
  }
};

export const saveUserProfile = async (
  uid: string,
  data: {
    uid: string;
    name: string;
    birthdate: string;
    avatar: string;
    favoriteGenres: number[];
    email: string;
    provider: string;
    isEmailVerified: boolean;
    createdAt: string;
  }
) => {
  await setDoc(doc(db, 'users', uid), data);
};

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
    return { success: false, error: error.code };
  }
};

export const sendVerificationLink = async () => {
  const user = auth.currentUser;
  if (user && !user.emailVerified) {
    await sendEmailVerification(user, { url: "http://localhost:3000/profile" });
  }
};

export const checkEmailVerificationAndUpdate = async () => {
  const user = auth.currentUser;
  if (!user) return;

  await user.reload(); // لازم نعمل reload علشان نجيب أحدث نسخة من اليوزر

  if (user.emailVerified) {
    try {
      // نحدث في Firestore إن الإيميل اتفعل
      await updateDoc(doc(db, 'users', user.uid), {
        isEmailVerified: true,
        verifiedAt: new Date().toISOString(), // ممكن تستخدم Timestamp.now() لو حابب
      });
    } catch (error: any) {
    }
  }
};

