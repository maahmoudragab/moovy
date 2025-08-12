"use client";
// React
import { useEffect, useState } from "react";

// Next.js
import Image from "next/image";
import { useRouter } from "next/navigation";

// Icons
import { CheckCircle } from "lucide-react";

// Firebase
import {
  getCurrentUser,
  getUserProfile,
  logoutUser,
  sendVerificationLink,
} from "@/firebase/authActions";

// Components
import Navbar from "@/components/shared/navbar";
import Title from "@/components/ui/title";
import SectionSlider from "@/components/shared/sectionSlider";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import EditProfileForm from "@/components/auth/editProfileForm";
import { Alert, AlertTitle } from "@/components/ui/alert";

// Single Requests
import FetchByGenres from "@/data/single_requests/fetch_geners";
import { MediaItem } from "@/data/HandleRequests";

import ScrollSmoothWrapper from "@/components/ScrollSmoothWrapper";


export default function ProfilePage() {
  const router = useRouter();
  const [timer, setTimer] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [favGenersData, setFavGenersData] = useState<MediaItem[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    const lastSent = sessionStorage.getItem("lastVerificationSent");
    if (lastSent) {
      const diff = 60 - Math.floor((Date.now() - parseInt(lastSent)) / 1000);
      if (diff > 0) {
        setTimer(diff);
      } else {
        sessionStorage.removeItem("lastVerificationSent");
      }
    }
  }, []);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          sessionStorage.removeItem("lastVerificationSent");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleSendVerification = async () => {
    if (isSending || timer > 0) return;

    setIsSending(true);
    try {
      await sendVerificationLink();

      // ⏱️ حفظ وقت الإرسال وبداية التايمر
      const now = Date.now();
      sessionStorage.setItem("lastVerificationSent", now.toString());
      setTimer(60);

      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error: any) {
      alert("فيه مشكلة: " + error.message);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const user = await getCurrentUser();

      if (user) {
        setIsEmailVerified(user.emailVerified);
      } else {
        router.replace("/");
        return;
      }

      const data = await getUserProfile(user.uid);
      if (!data || Object.keys(data).length <= 1) {
        router.replace("/auth/complete-profile");
        return;
      }

      const GenersData = (await FetchByGenres(data.favoriteGenres)).slice(0, 15);

      setFavGenersData(GenersData);
      setProfile(data);
      setUserChecked(true);
    };

    fetchProfile();
  }, [router]);
  if (!userChecked) return <Loading />;

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/auth/login");
  };

  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <li className="flex border-b border-white/10 p-1.5 w-full">
      <span className="text-white/90">{label}&nbsp;:&nbsp;</span>
      <span className="text-white/80">{value}</span>
    </li>
  );

  return (
    <>
      <Navbar />
      <ScrollSmoothWrapper>
        <main className="min-h-screen w-full pt-16 md:pt-28 px-4 md:px-8 relative z-10">
          <div
            className={`w-full fixed bottom-17 md:bottom-7 right-1/2 translate-x-1/2 z-45 transition-all duration-500
          ${showAlert
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5 pointer-events-none"
              }`}
          >
            <Alert
              variant="default"
              className="w-fit mx-auto shadow-lg overflow-hidden flex items-center gap-2"
            >
              <CheckCircle />
              <AlertTitle className="text-foreground w-full">
                تم إرسال رابط التفعيل إلى إيميلك
              </AlertTitle>
            </Alert>
          </div>

          <div className="absolute inset-0 -z-10">
            <Image
              src={profile.avatar}
              alt="صورة المستخدم"
              fill
              sizes="(max-width: 768px) 100vw, 200px"
              priority
              className="object-cover saturate-200"
            />
            <div
              className="absolute inset-0 bg-black/40"
              style={{ backdropFilter: "blur(200px)" }}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6 pb-8 items-center md:items-stretch">
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] shrink-0 overflow-hidden rounded-xl shadow-lg border-2 border-white/20">
              <Image
                src={profile.avatar || "/images/default-avatar.png"}
                alt="صورة المستخدم"
                fill
                className="object-cover"
              />
            </div>

            <div className="w-full flex flex-col justify-between text-white self-stretch">
              <Title>بيانات الحساب</Title>

              <div className="flex gap-2">
                <Button
                  onClick={() => setEditOpen(true)}
                  className="flex-1 rounded-xl"
                >
                  تعديل بياناتي
                </Button>
                <Button
                  onClick={() => setLogoutConfirmOpen(true)}
                  variant="default"
                  className="flex-1 rounded-xl bg-red-500 hover:bg-red-500/50 text-white"
                >
                  تسجيل خروج
                </Button>
              </div>

              <ul className="flex flex-col gap-2 text-base mt-4">
                <InfoRow label="الاسم" value={profile.name} />
                <InfoRow label="البريد الإلكتروني" value={profile.email} />
                <InfoRow label="تاريخ الميلاد" value={profile.birthdate} />
                <InfoRow label="مزود الدخول" value={profile.provider} />
                <InfoRow
                  label="تأكيد الإيميل"
                  value={
                    isEmailVerified ? (
                      <span className="text-green-400 flex items-center gap-1">
                        مؤكد <CheckCircle size={16} />
                      </span>
                    ) : (
                      <div className="flex items-center gap-2 ">
                        <span className="text-red-400">غير مؤكد</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSendVerification}
                          disabled={isSending || timer > 0}
                        >
                          {timer > 0
                            ? `إعادة الإرسال خلال ${timer}ث`
                            : "تفعيل الإيميل"}
                        </Button>
                      </div>
                    )
                  }
                />
                <InfoRow
                  label="تاريخ إنشاء الحساب"
                  value={new Date(profile.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-5">
            {profile.recent_views && profile.recent_views.length >= 1 && (
              <SectionSlider
                title="السجل"
                data={[...profile.recent_views].reverse()}
              />
            )}

            {profile.favorites && profile.favorites.length >= 1 && (
              <SectionSlider title="قائمة المفضلة" data={profile.favorites} />
            )}
            {favGenersData && (
              <SectionSlider title="الأقتراحات" data={favGenersData} />
            )}
          </div>
        </main>
      </ScrollSmoothWrapper>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-[#1a1a1a] w-[95%] max-w-md rounded-2xl px-4 md:px-8 py-8 shadow-2xl border border-white/10">
          <DialogTitle className="text-xl font-bold text-center">
            تعديل البيانات الشخصية
          </DialogTitle>

          <div className="flex flex-col gap-4">
            <p className="text-sm text-white/60 text-center -mt-2">
              عدل بياناتك واحفظ التغييرات
            </p>

            <EditProfileForm
              initialName={profile.name}
              initialBirthdate={profile.birthdate}
              initialAvatar={profile.avatar}
              onSuccess={() => {
                window.location.reload();
                setEditOpen(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <DialogContent className="bg-[#1a1a1a] w-[95%] max-w-md rounded-2xl px-6 py-8 shadow-2xl border border-white/10">
          <DialogTitle className="text-xl font-bold text-center">
            هل انت متأكد من تسجيل الخروج
          </DialogTitle>
          <div className="flex justify-between gap-2">
            <Button
              onClick={() => setLogoutConfirmOpen(false)}
              className="flex-1 rounded-xl bg-gray-600 hover:bg-gray-500"
            >
              رجوع
            </Button>
            <Button
              onClick={handleLogout}
              className="flex-1 rounded-xl bg-red-500 hover:bg-red-500/60"
            >
              تأكيد الخروج
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
