import SectionSlider from "@/components/shared/sectionSlider";
import { FullDetailsType } from "@/data/single_requests/fetch_details";

export default function RecommendationSection({ 
  recommendation 
}: { 
  recommendation: FullDetailsType["recommendation"];
}) {
  if (recommendation.length <= 2) return null;

  return (
    <SectionSlider
      title="الأقتراحات"
      data={recommendation.slice(0, 12)}
    />
  );
}