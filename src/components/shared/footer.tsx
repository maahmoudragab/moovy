import Link from "next/link"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const socialLinks = [
  { href: "https://facebook.com/maahmoudragab", icon: "/images/icons/facebook.png", label: "فيسبوك" },
  { href: "https://x.com/maahmoudragab", icon: "/images/icons/x.png", label: "أكس" },
  { href: "https://instagram.com/maahmoudragab", icon: "/images/icons/instagram.png", label: "انستجرام" },
  { href: "https://github.com/maahmoudragab", icon: "/images/icons/github.png", label: "جيتهب" },
  { href: "https://linkedin.com/in/maahmoudragab/", icon: "/images/icons/linkedin.png", label: "لينكدان" },
]

const quickLinks = [
  { href: "/", label: "الرئيسية", },
  { href: "/section/latest", label: "أحدث الإضافات", },
  { href: "/profile", label: "حسابي", },
  { href: "/auth/login", label: "تسجيل الدخول", },
]

const exploreLinks = [
  { href: "/section/popular_movies", label: "الأفلام الرائجة", },
  { href: "/section/popular_series", label: "المسلسلات الرائجة", },
  { href: "/section/arabic_movies", label: "أفلام عربية", },
  { href: "/section/kr_series", label: "مسلسلات كورية", },
]

export default function Footer() {

  return (
    <footer className="relative mt-8 px-4 md:px-8 bg-gradient-to-b from-[#ffffff08] to-[#ffffff15] backdrop-blur-xl border-t border-white/10 z-20 overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
      <div className="absolute top-10 right-20 w-24 h-24 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-16 left-12 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

      <div className="relative py-6 md:py-8 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="lg:col-span-1 space-y-2 md:space-y-4">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 p-1 rounded-2xl border border-white/10">
                  <Image
                    src="/images/moovy.webp"
                    width={55}
                    height={55}
                    alt="Moovy Hub Logo"
                    className="transition-transform group-hover:scale-110 duration-300"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-xl mb-1 font-bold">
                  موڤي
                </h2>
                <p className="text-xs font-medium">منصة الأفلام والمسلسلات</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-gray-300 leading-relaxed text-xs md:text-sm">
                تعرف على تفاصيل دقيقة عن الأفلام والمسلسلات من ملخصات، تصنيفات، تقييمات، مواعيد عرض، وأكثر بالعربي.
              </p>
            </div>
          </div>

          <div className="space-y-2 md:space-y-4">
            <h3 className="text-md font-bold text-white relative pb-2">
              روابط سريعة
              <div className="absolute bottom-0 right-0 w-1/2 h-0.5 bg-gradient-to-r from-primary/0 to-primary rounded-full"></div>
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1.5 transition-all duration-300 flex items-center gap-2.5 group text-xs md:text-sm py-0.5"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"></div>
                    <span className="group-hover:text-primary/90 transition-colors duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 md:space-y-4">
            <h3 className="text-md font-bold text-white relative pb-2">
              استكشف المحتوى
              <div className="absolute bottom-0 right-0 w-1/2 h-0.5 bg-gradient-to-r from-primary/0 to-primary rounded-full"></div>
            </h3>
            <ul className="space-y-2">
              {exploreLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1.5 transition-all duration-300 flex items-center gap-2.5 group text-xs md:text-sm py-0.5"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"></div>
                    <span className="group-hover:text-primary transition-colors duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 md:space-y-4">
            <h3 className="text-md font-bold text-white relative pb-2">
              تواصل معنا
              <div className="absolute bottom-0 right-0 w-1/2 h-0.5 bg-gradient-to-r from-primary/0 to-primary rounded-full"></div>
            </h3>

            <div className="grid grid-cols-5 gap-2">
              <TooltipProvider>
                {socialLinks.map((social, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Link
                        href={social.href}
                        target="_blank"
                        className="group relative p-2 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                      >
                        <Image
                          src={social.icon || "/placeholder.svg"}
                          width={18}
                          height={18}
                          alt={social.label}
                          className="transition-transform group-hover:scale-110 mx-auto"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-white text-xs font-medium">{social.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-center md:text-right">
              <p className="text-white/70 text-xs md:text-sm">
                © {new Date().getFullYear()} <span className="text-primary font-medium">Moovy</span>. كل الحقوق
                محفوظة.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs md:text-sm">
              <Link
                href="/"
                className="text-white/70 hover:text-primary transition-colors duration-300 hover:underline"
              >
                سياسة الخصوصية
              </Link>
              <div className="w-2 h-2 bg-white/70 rounded-full"></div>
              <Link
                href="/"
                className="text-white/70 hover:text-primary transition-colors duration-300 hover:underline"
              >
                الشروط والأحكام
              </Link>
              <div className="w-2 h-2 bg-white/70 rounded-full"></div>
              <Link
                href="/"
                className="text-white/70 hover:text-primary transition-colors duration-300 hover:underline"
              >
                اتصل بنا
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
