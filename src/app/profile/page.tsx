"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

// Firebase
import {
  getCurrentUser,
  getUserProfile,
  logoutUser,
} from "@/firebase/authActions";

// Components
import Navbar from "@/components/shared/navbar";
import Title from "@/components/ui/title";
import MainSlider from "@/components/shared/mainSlider";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"; // لو بتستخدم شاد CN أو معمول لك رابر لل Dialog
import EditProfileForm from "@/components/auth/EditProfileForm";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const [userChecked, setUserChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace("/");
        return;
      }

      const data = await getUserProfile(user.uid);
      if (!data || Object.keys(data).length <= 1) {
        router.replace("/auth/complate-profile")
        return
      }
      if (data) setProfile(data);
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

      {/* المحتوى */}
      <main className="min-h-screen w-full pt-16 md:pt-28 px-4 md:px-8 py-8 relative z-10">

        {/* الخلفية */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={profile.avatar || "/images/default-avatar.png"}
            alt="صورة المستخدم"
            fill
            sizes="100vw"
            priority
            className="object-cover saturate-200"
          />
          <div
            className="absolute inset-0 bg-black/60"
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
              <Button onClick={() => setEditOpen(true)} className="flex-1 rounded-xl">
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
                  profile.isEmailVerified ? (
                    <span className="text-green-400 flex items-center gap-1">
                      مؤكد <CheckCircle size={16} />
                    </span>
                  ) : (
                    <span className="text-red-400">غير مؤكد</span>
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

        {profile.favorites && profile.favorites.length >= 1 && (
          <div className="px-2 md:px-4 py-2 md:py-4 bg-[#ffffff1a] border rounded-xl">
            <MainSlider title="قائمة المفضلة" data={profile.favorites} />
          </div>
        )}

      </main>

      {/* مودال تعديل البيانات */}

      <Dialog open={editOpen} onOpenChange={setEditOpen} >
        <DialogContent className="bg-[#1a1a1a] w-[95%] max-w-md rounded-2xl px-4 md:px-8 py-8 shadow-2xl border border-white/10">

          {/* ده العنوان اللي بيطلبه Radix */}
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
                window.location.reload()
                setEditOpen(false)
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
