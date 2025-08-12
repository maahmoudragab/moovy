"use client"
// React
import { useState } from "react"

// Next.js
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Firebase
import { loginWithEmail, loginWithGoogle } from "@/firebase/authActions"

// Zod Schema & Form Controller
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/validations/auth"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Icons
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

// Types
type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  // Show/hide password toggle
  const [showPassword, setShowPassword] = useState(false)
  // Server error message state
  const [serverError, setServerError] = useState("")
  // Loading state during requests
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Login with email & password handler
  const handleEmailLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    setServerError("")

    try {
      await loginWithEmail(data.email, data.password)
      router.push("/") // Redirect to homepage on success
    } catch (error) {
      console.log(error)
      setServerError("البريد الإلكتروني أو كلمة المرور غير صحيحة")
    } finally {
      setIsLoading(false)
    }
  }

  // Login with Google handler
  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setServerError("")

    try {
      await loginWithGoogle()
      router.push("/")
    } catch (error) {
      console.log(error)
      setServerError("تعذر تسجيل الدخول بجوجل")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full bg-transparent border-none shadow-none p-0">
      {/* Header with title and description */}
      <CardHeader className="text-center p-0 gap-2">
        <CardTitle className="text-lg md:text-xl lg:text-2xl font-bold">
          مرحباً بك مرة أخرى
        </CardTitle>
        <CardDescription className="text-white/90 text-sm md:text-base lg:text-lg">
          سجل دخولك للوصول إلى حسابك
        </CardDescription>
      </CardHeader>

      {/* Form content */}
      <CardContent className="p-0 space-y-3">
        <form onSubmit={handleSubmit(handleEmailLogin)} className="space-y-2">
          {/* Email input */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-white font-medium text-sm md:text-base mb-2">
              البريد الإلكتروني
            </Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" />
              <Input
                id="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="pr-10 h-10 rounded-md text-white border-none placeholder:text-white/50 focus-visible:ring-1 focus-visible:ring-white/30"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password input with show/hide toggle */}
          <div className="space-y-1">
            <Label htmlFor="password" className="text-white font-medium text-sm md:text-base mb-2">
              كلمة المرور
            </Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                className="pr-10 h-10 pl-10 rounded-md text-white border-none placeholder:text-white/50 focus-visible:ring-1 focus-visible:ring-white/30"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
          </div>

          {/* Server error message */}
          {serverError && <p className="text-red-400 text-sm">{serverError}</p>}

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full h-10 bg-black/50 hover:bg-black/70 text-white font-medium rounded-md mt-5"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                جاري تسجيل الدخول...
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              </div>
            ) : (
              "تسجيل الدخول"
            )}
          </Button>
        </form>

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-3 py-0.5 rounded-full bg-black/50 text-white">أو</span>
          </div>
        </div>

        {/* Google login button */}
        <Button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full h-10 bg-black/50 hover:bg-black/70 text-white font-medium rounded-md"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center w-full">
              جاري تسجيل الدخول...
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              تسجيل الدخول بجوجل
              <Image alt="logo" className="rounded-full" src={"/images/icons/google.png"} width={25} height={25} unoptimized />
            </div>
          )}
        </Button>

        {/* Links for forgot password and signup */}
        <div className="text-center space-y-3">
          <Link
            href="/reset-password"
            className="text-sm text-primary hover:underline transition-colors"
          >
            نسيت كلمة المرور؟
          </Link>
          <p className="text-sm text-white/90">
            ليس لديك حساب؟{" "}
            <Link
              href="/auth/signup"
              className="text-primary font-medium hover:underline transition-colors"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
