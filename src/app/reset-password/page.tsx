'use client';
// React
import { useState } from "react"

// Zod Schema & Form Controller
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// Firebase
import { resetPassword } from "@/firebase/authActions"

// UI Components
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Footer from "@/components/shared/footer";


const schema = z.object({
  email: z.string().email("اكتب إيميل صحيح"),
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [message, setMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setMessage('');
    const res = await resetPassword(data.email);
    if (res.success) {
      setMessage('بعتنالك لينك على الإيميل، راجعه وكمّل من هناك.');
    } else {
      if (res.error === 'auth/user-not-found') {
        setMessage('الإيميل مش مرتبط بأي حساب.');
      } else {
        setMessage('في مشكلة حصلت، جرب تاني.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 space-y-4 w-full max-w-sm mx-auto mt-10"
      >
        <Input type="email" placeholder="الإيميل" {...register('email')} />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
        {message && (
          <p className="text-sm text-blue-600">{message}</p>
        )}
        <Button type="submit" className="w-full">
          ابعت لينك إعادة تعيين
        </Button>
      </form>
      <Footer />
    </div>
  );

}
