// Next Types & Fonts
import type { Metadata } from "next";
import { Alexandria } from "next/font/google";

// Global Styles
import "./globals.css";


const alexandria = Alexandria({
  variable: "--font-geist-alexandria",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "Moovy - موسوعة الأفلام والمسلسلات بالعربي",

  description: "Moovy هو موسوعة شاملة بتعرض تفاصيل دقيقة عن الأفلام والمسلسلات، من مواعيد العرض، التصنيفات، التقييمات، والملخصات بالعربي.",

  keywords: [
    "Moovy",
    "موفي",
    "موفيز",
    "موفيز بالعربي",
    "موفي بالعربي",
    "موفيز مصر",
    "موفي عربي",
    "موسوعة أفلام",
    "موسوعة مسلسلات",
    "موسوعة الأفلام والمسلسلات",
    "تفاصيل الأفلام",
    "تفاصيل المسلسلات",
    "ملخص أفلام",
    "ملخص المسلسلات",
    "تقييمات أفلام",
    "تقييمات مسلسلات",
    "تقييم أفلام بالعربي",
    "تقييم مسلسلات بالعربي",
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
    "مسلسلات 2025",
    "قائمة أفلام عربية",
    "قائمة مسلسلات عربية",
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


  openGraph: {
    title: "Moovy - موسوعة الأفلام والمسلسلات بالعربي",

    description: "تعرف على تفاصيل دقيقة عن الأفلام والمسلسلات من ملخصات، تصنيفات، تقييمات، مواعيد عرض، وأكثر بالعربي.",

    url: "https://moovy-hub.vercel.app",

    siteName: "Moovy",

    images: [
      {
        url: "/images/moovy.png",

        width: 1280,
        height: 1280,
        alt: "Moovy - موسوعة الأفلام والمسلسلات",
        type: "image/webp",
      }
    ],

    locale: "ar_AR",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Moovy - موسوعة الأفلام والمسلسلات بالعربي",

    description: "تعرف على تفاصيل دقيقة عن الأفلام والمسلسلات من ملخصات، تصنيفات، تقييمات، مواعيد عرض، وأكثر بالعربي.",

    images: ["https://moovy-hub.vercel.app/"],

    creator: "@maahmoudragab",
  },

  verification: {
    google: "HJcQ06N13ZmafDcTz4ph34ghIvb37tCX9mqz9-zUcEk",
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


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`${alexandria.className} antialiased overflow-x-hidden`} >
        {children}
      </body>
    </html>
  );
}
