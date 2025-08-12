import Loaders from "@/components/loaders/loaders";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="relative text-3xl md:text-6xl font-bold tracking-wider text-white" dir="rtl">
        <Loaders />
      </div>
    </div>
  )
}