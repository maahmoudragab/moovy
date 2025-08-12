import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email({ message: "الإيميل مش واضح، تأكد إنه صح" }),
  password: z.string().trim().min(6, { message: "الباسورد لازم 6 حروف على الأقل" }),
});

export const signupSchema = z.object({
  email: z.string().email("الإيميل مش واضح، تأكد إنه صح"),
  password: z.string().min(6, "الباسورد لازم 6 حروف على الأقل"),
});

export const completeProfileSchema = z.object({
  name: z.string().min(2, "الاسم لازم يكون حرفين على الأقل"),
  birthdate: z.string().min(1, "اختر تاريخ الميلاد"), // ✅ string مع validation
  avatar: z.string().min(1, "اختار صورة"),
  favoriteGenres: z.array(z.string()).min(1, "اختر تصنيف واحد على الأقل"),
})

export const editProfileSchema = z.object({
  name: z.string().min(2, "الاسم لازم يكون على الأقل حرفين"),
  birthdate: z.string().min(1, "تاريخ الميلاد مطلوب"),
  avatar: z.string().min(1, "اختيار صورة ضروري"),

})
