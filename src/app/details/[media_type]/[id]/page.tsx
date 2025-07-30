// Next
import { notFound } from "next/navigation";

// Data
import FetchDetails from "@/data/single_requests/fetch_details";

// App Components
import DetailsContent from "@/components/details";

// كومبوننت صفحة التفاصيل - بترجع تفاصيل فيلم أو مسلسل حسب نوعه ومعرّفه
export default async function MediaDetailsPage({ params }: { params: Promise<{ id: string; media_type: string }> }) {

  // استخراج id و media_type من البارامز بعد ما تتحل البروميس
  const { id, media_type } = await params;

  // لو نوع الميديا مش فيلم أو مسلسل نرجع صفحة 404
  if (media_type !== "movie" && media_type !== "tv") return notFound();

  // جلب التفاصيل من TMDB أو المصدر الخاص بيك
  const data = await FetchDetails(id, media_type);

  // عرض تفاصيل المحتوى باستخدام كومبوننت DetailsContent
  return <DetailsContent item={data!} />;
}
