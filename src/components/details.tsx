import { MediaItem } from "@/data/HandleRequests";

export default function DetailsContent({ item }: { item: MediaItem }) {
  return (
    <section className="p-4 md:p-10 flex flex-col gap-4">
      {/* 🏷️ العنوان والوصف */}
      <h1 className="text-2xl md:text-4xl font-bold">{item.title_ar}</h1>
      <p className="text-sm md:text-base text-muted-foreground">{item.overview}</p>

      {/* 🔖 شوية تفاصيل سريعة */}
      <div className="flex flex-wrap gap-2 mt-4">
        <span className="bg-muted px-3 py-1 rounded-full text-sm">النوع: {item.type}</span>
        <span className="bg-muted px-3 py-1 rounded-full text-sm">اللغة: {item.original_language}</span>
        <span className="bg-muted px-3 py-1 rounded-full text-sm">التقييم: {item.vote_average}</span>
      </div>

      {/* 🖼️ الصورة الخلفية */}
      <div className="mt-6">
        <img
          src={item.backdrop_path}
          alt={item.title_ar}
          className="rounded-lg w-full max-h-[500px] object-cover"
        />
      </div>
    </section>
  );
}
