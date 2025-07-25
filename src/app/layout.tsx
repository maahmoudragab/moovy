import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";


const alexandria = Alexandria({
  variable: "--font-geist-alexandria",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "Moovy - تابع أفلام ومسلسلات بجودة عالية | مشاهدة مباشرة بدون إعلانات",
  description: "Moovy هو أفضل موقع لمتابعة أحدث الأفلام والمسلسلات العربية والأجنبية بجودة عالية. استكشف عالم من الإثارة، الغموض، الأكشن، الكوميديا والمزيد بدون إعلانات مزعجة.",
  keywords: [
    "Moovy", "مشاهدة أفلام", "مسلسلات", "أفلام أجنبية", "أفلام عربية",
    "مسلسلات تركية", "أنمي", "أكشن", "رعب", "غموض", "موقع أفلام", "streaming"
  ],
  authors: [{ name: "Moovy Team", url: "https://moovy.com" }],
  creator: "Moovy",
  applicationName: "Moovy",
  generator: "Next.js",
  metadataBase: new URL("https://moovy.com"),
  openGraph: {
    title: "Moovy - تابع أفلام ومسلسلات بجودة عالية",
    description: "أحدث الأفلام والمسلسلات الأجنبية والعربية والأنمي في مكان واحد. بدون إعلانات وبجودة خرافية.",
    url: "https://moovy.com",
    siteName: "Moovy",
    images: [
      {
        url: "/images/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Moovy - مشاهدة أفلام ومسلسلات",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moovy - أفلام ومسلسلات بجودة عالية",
    description: "تابع أحدث الأفلام والمسلسلات مجانًا وبدون إعلانات على Moovy.",
    images: ["/images/og-cover.png"],
    creator: "@moovyapp",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (

    <html lang="ar" dir="rtl" className="dark">
      <body className={`${alexandria.className} antialiased overflow-x-hidden`} >
        {children}
      </body>
    </html>);
}
