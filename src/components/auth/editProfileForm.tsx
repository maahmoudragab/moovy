"use client"
// React
import clsx from "clsx"
import { useState } from "react"

// Next.js
import Image from "next/image"

// Firebase
import { updateProfile } from "firebase/auth"
import { auth } from "@/firebase/firebaseConfig"
import { updateUserProfile } from "@/firebase/authActions"

// Zod Schema & Form Controller
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { editProfileSchema } from "@/validations/auth"

// UI Components
import { CalendarIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

// Types
type FormData = z.infer<typeof editProfileSchema>

// Constants
const AVATARS = Array.from({ length: 12 }, (_, i) => `/images/avatars/${i + 1}.png`)

export default function EditProfileForm(
  { initialName, initialBirthdate, initialAvatar, onSuccess }: {
    initialName: string; initialBirthdate: string; initialAvatar: string; onSuccess?: () => void
  }) {

  const [serverError, setServerError] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar)

  // React Hook Form setup with zod validation and default values
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: initialName,
      birthdate: initialBirthdate,
      avatar: initialAvatar,
    },
  })

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    const user = auth.currentUser
    if (!user) return

    setServerError("")

    // Update Firebase Auth profile with new name and avatar
    await updateProfile(user, {
      displayName: data.name,
      photoURL: data.avatar,
    })

    // Update Firestore user profile document
    await updateUserProfile(user.uid, {
      name: data.name,
      birthdate: data.birthdate,
      avatar: data.avatar,
    })

    // Callback after success (optional)
    onSuccess?.()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx("relative space-y-6", isSubmitting && "pointer-events-none opacity-50")}
    >
      {/* Name input */}
      <div className="space-y-2">
        <Label className="text-white">الاسم</Label>
        <Input
          {...register("name")}
          placeholder="اسمك"
          className="p-3 h-10 text-white border-none placeholder:text-white/50 focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:outline-none"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Birthdate picker */}
      <div className="space-y-2">
        <Label className="text-white">تاريخ الميلاد</Label>
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
                    className="p-3 h-10 text-white border-none placeholder:text-white/50 focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:outline-none"
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
        {errors.birthdate && <p className="text-red-500 text-sm">{errors.birthdate.message}</p>}
      </div>

      {/* Avatar selection */}
      <div className="space-y-2">
        <Label className="text-white">الصورة الشخصية</Label>
        <div className="grid grid-cols-4 gap-3">
          {AVATARS.map((url, i) => (
            <Image
              key={i}
              src={url}
              alt={`Avatar ${i + 1}`}
              width={80}
              height={80}
              onClick={() => {
                setSelectedAvatar(url)
                setValue("avatar", url, { shouldValidate: true })
              }}
              className={clsx(
                "w-20 h-20 rounded-full border-2 cursor-pointer transition-all hover:scale-105",
                selectedAvatar === url ? "border-primary scale-105" : "border-transparent"
              )}
            />
          ))}
        </div>
        <Input type="hidden" {...register("avatar")} />
        {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar.message}</p>}
      </div>

      {/* Server error message */}
      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

      {/* Submit button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <span>جاري الحفظ...</span>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          </>
        ) : (
          "حفظ التعديلات"
        )}
      </Button>
    </form>
  )
}
