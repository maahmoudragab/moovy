"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { auth } from "@/firebase/firebaseConfig"
import { updateProfile } from "firebase/auth"
import { useRouter } from "next/navigation"
import Image from "next/image"
import clsx from "clsx"
import type { z } from "zod"

// UI Components
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"

// Schema & Actions
import { completeProfileSchema } from "@/validations/auth"
import { saveUserProfile } from "@/firebase/authActions"

// Types
type FormData = z.infer<typeof completeProfileSchema>

// Constants
const AVATARS = Array.from({ length: 12 }, (_, i) => `/images/avatars/${i + 1}.png`)
const GENRES = [
  "رعب",
  "دراما",
  "أكشن",
  "كوميدي",
  "خيال علمي",
  "رومانسي",
  "مغامرة",
  "تشويق",
  "أنمي",
  "تاريخي",
  "جريمة",
  "فانتازيا",
]

export default function CompleteProfile() {
  // State
  const [selectedAvatar, setSelectedAvatar] = useState("")
  const [serverError, setServerError] = useState("")
  const router = useRouter()

  // Form Setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(completeProfileSchema),
  })

  const selectedGenres = watch("favoriteGenres") || []

  // Submit Handler
  const handleSave = async (data: FormData) => {
    const user = auth.currentUser
    if (!user) return

    try {
      setServerError("")

      // تحديث بيانات Firebase Auth
      await updateProfile(user, {
        displayName: data.name,
        photoURL: data.avatar,
      })

      // حفظ البيانات في Firestore
      await saveUserProfile(user.uid, {
        uid: user.uid,
        name: data.name,
        birthdate: data.birthdate,
        avatar: data.avatar,
        favoriteGenres: data.favoriteGenres,
        email: user.email || "",
        provider: user.providerData[0]?.providerId || "unknown",
        isEmailVerified: user.emailVerified,
        createdAt: user.metadata.creationTime || "",
      })

      router.push("/")
    } catch (err) {
      console.error(err)
      setServerError("حصلت مشكلة أثناء الحفظ")
    }
  }

  // Avatar Selection Handler
  const handleAvatarSelect = (url: string) => {
    setSelectedAvatar(url)
    setValue("avatar", url, { shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
      {/* العنوان */}
      <h1 className="text-2xl font-bold text-white text-center">أكمل ملفك الشخصي</h1>

      {/* حقل الاسم */}
      <div>
        <Label className="text-white font-medium mb-2">الاسم</Label>
        <Input
          placeholder="اسمك"
          {...register("name")}
          className="p-3 h-10 text-white border-none placeholder:text-white/50 focus-visible:ring-1 focus-visible:ring-white/30"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* حقل تاريخ الميلاد */}
      <div>
        <Label className="text-white mb-2">تاريخ الميلاد</Label>
        <Controller
          name="birthdate"
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
                  <Input
                    readOnly
                    value={field.value || ""}
                    placeholder="اختر تاريخ الميلاد"
                    className="pl-10 p-3 h-10 bg-white/10 text-white border-none placeholder:text-white/50 cursor-pointer"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white text-black">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    field.onChange(date ? date.toLocaleDateString("en-CA") : "")
                  }}
                  captionLayout="dropdown"
                  fromYear={1960}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.birthdate && <p className="text-red-500 text-sm mt-1">{errors.birthdate.message}</p>}
      </div>

      {/* التصنيفات المفضلة */}
      <div>
        <Label className="text-white font-medium mb-2">التصنيفات المفضلة</Label>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {GENRES.map((genre) => (
            <label key={genre} className="cursor-pointer">
              <input type="checkbox" value={genre} {...register("favoriteGenres")} className="peer hidden" />
              <span
                className={clsx(
                  "inline-block w-full px-3 py-1.5 rounded-md text-center bg-black/40 text-white transition-colors",
                  selectedGenres.includes(genre) && "bg-primary",
                )}
              >
                {genre}
              </span>
            </label>
          ))}
        </div>
        {errors.favoriteGenres && <p className="text-red-500 text-sm mt-2">{errors.favoriteGenres.message}</p>}
      </div>

      {/* الصورة الشخصية */}
      <div>
        <Label className="text-white font-medium mb-2">الصورة الشخصية</Label>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {AVATARS.map((url, i) => (
            <Image
              key={i}
              src={url || "/placeholder.svg"}
              width={80}
              height={80}
              alt={`Avatar ${i + 1}`}
              className={clsx(
                "w-20 h-20 rounded-full border-2 cursor-pointer transition-all hover:scale-105",
                selectedAvatar === url ? "border-primary scale-105" : "border-transparent",
              )}
              onClick={() => handleAvatarSelect(url)}
            />
          ))}
        </div>
        <Input type="hidden" {...register("avatar")} />
        {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar.message}</p>}
      </div>

      {/* رسالة الخطأ */}
      {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}

      {/* زر الحفظ */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "جاري الحفظ..." : "حفظ"}
      </Button>
    </form>
  )
}
