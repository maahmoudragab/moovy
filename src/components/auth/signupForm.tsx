'use client'
// React
import { useState } from "react"

// Next.js
import Link from "next/link"
import { useRouter } from "next/navigation"

// Firebase
import { registerWithEmail, loginWithGoogle } from "@/firebase/authActions"

// Zod Schema & Form Controller
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signupSchema } from "@/validations/auth"

// UI Components
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Icons
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Image from "next/image"

// Types
type FormData = z.infer<typeof signupSchema>

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
  })

  // handle form submission for email/password signup
  const handleSignup = async (data: FormData) => {
    setServerError('')
    setIsLoading(true)
    try {
      await registerWithEmail(data.email, data.password)
      router.push('/auth/complete-profile')
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setServerError('الإيميل ده مسجل قبل كده، حاول تاني')
      } else {
        setServerError('حصلت مشكلة في التسجيل، جرب تاني')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // handle signup with Google OAuth
  const handleGoogleSignup = async () => {
    setServerError('')
    setIsLoading(true)
    try {
      await loginWithGoogle()
      router.push('/auth/complete-profile')
    } catch (error) {
      console.log(error)
      setServerError('فشل تسجيل الحساب بجوجل')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full bg-transparent border-none shadow-none p-0">
      {/* Title and description */}
      <CardHeader className="text-center p-0 gap-2">
        <CardTitle className="text-lg md:text-xl lg:text-2xl font-bold">إنشاء حساب جديد</CardTitle>
        <CardDescription className="text-white/90 text-sm md:text-base lg:text-lg">
          أنشئ حسابك للبدء باستخدام المنصة
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        <form onSubmit={handleSubmit(handleSignup)} className="space-y-2">
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
                {...register('email')}
              />
            </div>
            {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password input with toggle */}
          <div className="space-y-1">
            <Label htmlFor="password" className="text-white font-medium text-sm md:text-base mb-2">
              كلمة المرور
            </Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="أدخل كلمة المرور"
                className="pr-10 h-10 pl-10 rounded-md text-white border-none placeholder:text-white/50 focus-visible:ring-1 focus-visible:ring-white/30"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                aria-label={showPassword ? "اخفاء كلمة المرور" : "اظهار كلمة المرور"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
          </div>

          {/* Server error */}
          {serverError && <p className="text-red-400 text-sm">{serverError}</p>}

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full h-10 bg-black/50 hover:bg-black/70 text-white font-medium rounded-md mt-5"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                جاري إنشاء الحساب...
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
            ) : (
              'إنشاء حساب'
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

        {/* Signup with Google */}
        <Button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full h-10 bg-black/50 hover:bg-black/70 text-white font-medium rounded-md"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              جاري إنشاء الحساب...
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              إنشاء حساب بجوجل
              <Image alt="logo" className="rounded-full" src={"/images/icons/google.png"} width={25} height={25} unoptimized />
            </div>
          )}
        </Button>

        {/* Login link */}
        <div className="text-center space-y-3">
          <p className="text-sm text-white/90">
            لديك حساب بالفعل؟{' '}
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:underline transition-colors"
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
