export default function getLanguageName(lang: string): string {
  const langs: Record<string, string> = {
    en: "الإنجليزية",
    ar: "العربية",
    fr: "الفرنسية",
    es: "الإسبانية",
    de: "الألمانية",
    it: "الإيطالية",
    ja: "اليابانية",
    ko: "الكورية",
    zh: "الصينية",
    ru: "الروسية",
    hi: "الهندية",
    tr: "التركية",
    pt: "البرتغالية",
  };

  return langs[lang] || "غير معروفة";
}
