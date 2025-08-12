"use client"

// React
import { useEffect, useState } from "react"

// Next.js
import { useRouter } from "next/navigation"
import Image from "next/image"

// Firebase
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/firebase/firebaseConfig"

// Components
import LoginForm from "@/components/auth/loginForm"
import Title from "@/components/ui/title"


export default function LoginPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true) // ⬅️ حالة فحص المستخدم

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/")
      } else {
        setChecking(false) // ⬅️ السماح بعرض الصفحة لو مفيش يوزر
      }
    })
    return () => unsub()
  }, [router])

  if (checking) return null // ⬅️ متعرضش حاجة لحد ما نتأكد

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-2 md:p-4 bg-[url('/images/moviewall.jpg')] bg-cover bg-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-yellow-600/20"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="bg-black/30 w-full max-w-3xl backdrop-blur-3xl p-3 md:p-4 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="mb-2">
            <Title className="mb-2">موڤي</Title>
            <p className="text-primary text-base lg:text-lg">
              منصة الأفلام المفضلة لديك
            </p>
          </div>
          <Image
            src="/images/moovy.png"
            alt="Moovy Logo"
            width={100}
            height={100}
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
            priority
          />
        </div>

        <LoginForm />

        <p className="text-center mt-8 text-white/60 text-sm">
          جميع الحقوق محفوظة
          <span className="inline-block w-2 h-2 mx-2 rounded-full bg-white/60" />
          Moovy &#x00A9; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
