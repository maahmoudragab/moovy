// Next Types & Fonts
import type { Metadata } from "next";
import { Alexandria } from "next/font/google";

// Global Styles
import "./globals.css";
import ScrollSmoothWrapper from "@/components/ScrollSmoothWrapper";


const alexandria = Alexandria({
  variable: "--font-geist-alexandria",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "Moovy - مكتبة موفي",

  description: "مكتبة موفي مكانك لمعرفة كل جديد عن الأفلام والمسلسلات، من القصة والتقييمات لحد مواعيد العرض، وكل ده بالعربي.",

  keywords: [
    // Moovy
    "Moovy",
    "Moovy Arabic",
    "Moovy Egypt",
    "Moovy HD",
    "Moovy Movies",
    "Moovy Series",

    // مكتبة موفي
    "مكتبة موفي",
    "مكتبة موفي بالعربي",
    "مكتبة موفي HD",
    "مكتبة موفي عربي",
    "مكتبة موفي مصر",
    "مكتبة موفي اونلاين",
    "مشاهدة مكتبة موفي",
    "تحميل مكتبة موفي",
    "أحدث أفلام مكتبة موفي",
    "أحدث مسلسلات مكتبة موفي",
    "افضل افلام مكتبة موفي",
    "افضل مسلسلات مكتبة موفي",
    "مكتبة أفلام موفي",
    "مكتبة مسلسلات موفي",
    "تقييمات مكتبة موفي",
    "ملخصات مكتبة موفي",
    "أخبار مكتبة موفي",

    // Maktabat Moovy
    "Maktabat Moovy",
    "Maktabat Moovy Arabic",
    "Maktabat Moovy Egypt",
    "Maktabat Moovy HD",
    "Maktabat Moovy Movies",
    "Maktabat Moovy Series",

    // موفي
    "موفي",
    "موفي بالعربي",
    "موفي بالعربي HD",
    "موفي عربي",
    "موفي مصر",
    "موفي اونلاين",
    "مشاهدة موفي",
    "تحميل موفي",
    "أحدث أفلام موفي",
    "أحدث مسلسلات موفي",
    "افضل افلام موفي",
    "افضل مسلسلات موفي",
    "موفي HD",
    "تقييمات موفي",
    "ملخصات موفي",
    "أخبار موفي",

    // موفيز
    "موفيز",
    "موفيز بالعربي",
    "موفيز مصر",
    "موفيز عربي",

    // موسوعة موفيز
    "موسوعة موفيز",
    "موسوعة موفيز للأفلام",
    "موسوعة موفيز للمسلسلات",
    "موسوعة موفيز بالعربي",
    "أفضل أفلام موسوعة موفيز",
    "أفضل مسلسلات موسوعة موفيز",
    "أحدث أفلام موسوعة موفيز",
    "أحدث مسلسلات موسوعة موفيز",
    "موسوعة موفيز 2025",
    "موسوعة موفيز HD",

    // موسوعة موفي
    "موسوعة موفي",
    "موسوعة موفي للأفلام",
    "موسوعة موفي للمسلسلات",
    "موسوعة موفي بالعربي",
    "أفضل أفلام موسوعة موفي",
    "أفضل مسلسلات موسوعة موفي",
    "أحدث أفلام موسوعة موفي",
    "أحدث مسلسلات موسوعة موفي",
    "موسوعة موفي 2025",
    "موسوعة موفي HD",

    // موسوعة الأفلام والمسلسلات
    "موسوعة أفلام",
    "موسوعة مسلسلات",
    "موسوعة الأفلام والمسلسلات",
    "قائمة أفلام عربية",
    "قائمة مسلسلات عربية",

    // بيانات وتقييمات
    "تفاصيل الأفلام",
    "تفاصيل المسلسلات",
    "ملخص أفلام",
    "ملخص المسلسلات",
    "تقييمات أفلام",
    "تقييمات مسلسلات",
    "تقييم أفلام بالعربي",
    "تقييم مسلسلات بالعربي",

    // أفلام ومسلسلات عامة
    "أفلام بالعربي",
    "مسلسلات بالعربي",
    "بيانات الأفلام",
    "مواعيد عرض الأفلام",
    "مواعيد عرض المسلسلات",
    "تصنيفات الأفلام",
    "تصنيفات المسلسلات",
    "أفضل أفلام",
    "أفضل مسلسلات",
    "مشاهدة الأفلام",
    "مشاهدة المسلسلات",
    "قائمة الأفلام",
    "قائمة المسلسلات",
    "مراجعة أفلام",
    "مراجعة مسلسلات",
    "أخبار الأفلام",
    "أخبار المسلسلات",
    "أفلام جديدة",
    "مسلسلات جديدة",
    "افلام HD",
    "مسلسلات HD",
    "أفلام 2025",
    "مسلسلات 2025"
  ],

  creator: "Mahmoud Ragab",
  publisher: "Mahmoud Ragab",

  metadataBase: new URL("https://moovy-hub.vercel.app"),

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  applicationName: "Moovy",
  openGraph: {
    title: "Moovy - مكتبة موفي",
    description: "مكتبة موفي مكانك لمعرفة كل جديد عن الأفلام والمسلسلات، من القصة والتقييمات لحد مواعيد العرض، وكل ده بالعربي.",
    url: "https://moovy-hub.vercel.app",
    siteName: "Moovy",
    images: [
      {
        url: "/images/moovy.png",
        width: 780,
        height: 780,
        alt: "Moovy - مكتبة موفي"
      }
    ],
    locale: "ar_AR",
    type: "website",
  },

  icons: {
    icon: "/images/moovy.png"
  },

  twitter: {
    card: "summary_large_image",
    title: "Moovy - مكتبة موفي",
    description: "مكتبة موفي مكانك لمعرفة كل جديد عن الأفلام والمسلسلات، من القصة والتقييمات لحد مواعيد العرض، وكل ده بالعربي.",
    images: ["https://moovy-hub.vercel.app/images/moovy.png"],
    creator: "@maahmoudragab",
  },

  verification: {
    google: "IpDXTz417F3ZazMOu8KkliIfuwbw3wIFmNmPTG3LfI4",
  },

  other: {
    "google-site-verification": "HJcQ06N13ZmafDcTz4ph34ghIvb37tCX9mqz9-zUcEk"
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark" >
      <body className={`${alexandria.className} antialiased overflow-x-hidden`}>
        <ScrollSmoothWrapper>
          {children}
        </ScrollSmoothWrapper>
      </body>
    </html>
  );
}