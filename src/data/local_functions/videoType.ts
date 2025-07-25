const videoTypeTranslations: Record<string, string> = {
  Teaser: "إعلان تشويقي",
  Trailer: "إعلان رسمي",
  Clip: "مقطع",
  Featurette: "كواليس",
  "Behind the Scenes": "ما وراء الكواليس",
  Bloopers: "لقطات مضحكة",
  "Opening Credits": "تتر البداية",
  Recap: "ملخص",
};

export default function getVideoType(type: string): string {
  return videoTypeTranslations[type] || type;
}
