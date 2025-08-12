"use client"
// React
import clsx from "clsx"
import { useState } from "react"

// Next.js
import Image from "next/image"
import { useRouter } from "next/navigation"

// Firebase
import { updateProfile } from "firebase/auth"
import { auth } from "@/firebase/firebaseConfig"
import { saveUserProfile } from "@/firebase/authActions"

// Zod Schema & Form Controller
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { completeProfileSchema } from "@/validations/auth"

// UI Components
import { CalendarIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

// Types
type FormData = z.infer<typeof completeProfileSchema>

// Constants
const AVATARS = Array.from({ length: 12 }, (_, i) => `/images/avatars/${i + 1}.png`)
const GENRES = ["رعب", "دراما", "أكشن", "كوميدي", "خيال علمي", "رومانسي", "مغامرة", "تشويق", "أنمي", "تاريخي", "جريمة", "فانتازيا"]
const genreMap: { [key: string]: number } =
{
  "أكشن": 28, "مغامرة": 12, "أنمي": 16, "كوميدي": 35, "جريمة": 80, "دراما": 18,
  "فانتازيا": 14, "تاريخي": 36, "رعب": 27, "رومانسي": 10749, "خيال علمي": 878, "تشويق": 53
}

export default function CompleteProfile() {
  const [selectedAvatar, setSelectedAvatar] = useState("")
  const [serverError, setServerError] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(completeProfileSchema)
  })

  const selectedGenres = watch("favoriteGenres") || []

  // Handle form submission
  const handleSave = async (data: FormData) => {
    const user = auth.currentUser
    if (!user) return

    setServerError("")

    // Update Firebase auth profile display name and avatar
    await updateProfile(user, {
      displayName: data.name,
      photoURL: data.avatar,
    })

    // Save profile data to Firestore with mapped genre IDs
    await saveUserProfile(user.uid, {
      uid: user.uid,
      name: data.name,
      birthdate: data.birthdate,
      avatar: data.avatar,
      favoriteGenres: data.favoriteGenres
        .map((name) => genreMap[name])
        .filter((id) => id !== undefined),
      email: user.email || "",
      provider: user.providerData[0]?.providerId || "unknown",
      isEmailVerified: user.emailVerified,
      createdAt: user.metadata.creationTime || "",
    })

    // Redirect to home after saving
    router.push("/")
  }

  // Update selected avatar and form value
  const handleAvatarSelect = (url: string) => {
    setSelectedAvatar(url)
    setValue("avatar", url, { shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-bold text-white text-center">أكمل ملفك الشخصي</h1>

      {/* Name input */}
      <div>
        <Label className="text-white font-medium mb-2">الاسم</Label>
        <Input
          placeholder="اسمك"
          {...register("name")}
          className="p-3 h-10 text-white border-none placeholder:text-white/50 focus-visible:ring-1 focus-visible:ring-white/30"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Birthdate input */}
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
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) =>
                    field.onChange(date ? date.toLocaleDateString("en-CA") : "")
                  }
                  captionLayout="dropdown"
                  fromYear={1940}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.birthdate && <p className="text-red-500 text-sm mt-1">{errors.birthdate.message}</p>}
      </div>

      {/* Favorite genres checkboxes */}
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

      {/* Avatar selection */}
      <div>
        <Label className="text-white font-medium mb-2">الصورة الشخصية</Label>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {AVATARS.map((url, i) => (
            <Image
              key={i}
              src={url}
              width={80}
              height={80}
              alt={`Avatar ${i + 1}`}
              className={clsx(
                "w-20 h-20 rounded-full border-2 cursor-pointer transition-all hover:scale-105",
                selectedAvatar === url ? "border-primary scale-105" : "border-transparent"
              )}
              onClick={() => handleAvatarSelect(url)}
            />
          ))}
        </div>
        <Input type="hidden" {...register("avatar")} />
        {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar.message}</p>}
      </div>

      {/* Server error message */}
      {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}

      {/* Submit button */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "جاري الحفظ..." : "حفظ"}
      </Button>
    </form>
  )
}
