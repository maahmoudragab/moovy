export default function translateVideoType(type: string): string {
  const translations: Record<string, string> = {
    "Trailer": "إعلان تشويقي",
    "Teaser": "إعلان قصير",
    "Behind the Scenes": "وراء الكواليس",
    "Bloopers": "لقطات مضحكة",
    "Clip": "مقطع",
    "Featurette": "فيديو تعريفي",
    "Opening Credits": "تتر البداية",
    "Recap": "ملخص",
    "Scene": "مشهد",
  };

  return translations[type] || type;
}
