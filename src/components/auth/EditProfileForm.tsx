"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { z } from "zod"
import { updateProfile } from "firebase/auth"
import { auth } from "@/firebase/firebaseConfig"
import { updateUserProfile } from "@/firebase/authActions"

// UI
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import Image from "next/image"
import clsx from "clsx"

// Schema
import { editProfileSchema } from "@/validations/auth"
type FormData = z.infer<typeof editProfileSchema>

const AVATARS = Array.from({ length: 12 }, (_, i) => `/images/avatars/${i + 1}.png`)

export default function EditProfileForm({
  initialName,
  initialBirthdate,
  initialAvatar,
  onSuccess,
}: {
  initialName: string
  initialBirthdate: string
  initialAvatar: string
  onSuccess?: () => void
}) {
  const [serverError, setServerError] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar)

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

  const onSubmit = async (data: FormData) => {
    const user = auth.currentUser
    if (!user) return

    try {
      setServerError("")
      await updateProfile(user, {
        displayName: data.name,
        photoURL: data.avatar,
      })

      await updateUserProfile(user.uid, {
        name: data.name,
        birthdate: data.birthdate,
        avatar: data.avatar,
      })

      onSuccess?.()
    } catch (err) {
      console.error(err)
      setServerError("حصلت مشكلة أثناء التحديث")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-6">
      <div className={isSubmitting ? "pointer-events-none opacity-50 space-y-6" : "space-y-6"}>
        {/* الاسم */}
        <div className="space-y-2">
          <Label className="text-white">الاسم</Label>
          <Input
            {...register("name")}
            className="p-3 h-10 text-white border-none placeholder:text-white/50 focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:outline-none"
            placeholder="اسمك"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* تاريخ الميلاد */}
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
                    onSelect={(date) =>
                      field.onChange(date ? date.toLocaleDateString("en-CA") : "")
                    }
                    captionLayout="dropdown"
                    fromYear={1960}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.birthdate && (
            <p className="text-red-500 text-sm">{errors.birthdate.message}</p>
          )}
        </div>

        {/* الصورة الشخصية */}
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
                  setValue("avatar", url, { shouldValidate: true })
                  setSelectedAvatar(url)
                }}
                className={clsx(
                  "w-20 h-20 rounded-full border-2 cursor-pointer transition-all hover:scale-105",
                  selectedAvatar === url ? "border-primary scale-105" : "border-transparent"
                )}
              />
            ))}
          </div>

          <Input type="hidden" {...register("avatar")} />
          {errors.avatar && (
            <p className="text-red-500 text-sm">{errors.avatar.message}</p>
          )}
        </div>

        {/* خطأ السيرفر */}
        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

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

      </div >
    </form >
  )
}
