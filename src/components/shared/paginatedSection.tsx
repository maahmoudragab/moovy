"use client"

import { useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { gsap } from "gsap"
import Title from "@/components/ui/title"

type Props = {
  title: string
  totalPages: number
  currentPage: number
  setCurrentPage: (page: number) => void
  children: React.ReactNode
}

export default function PaginatedSection({ title, totalPages, currentPage, setCurrentPage, children }: Props) {
  const contentRef = useRef<HTMLDivElement>(null)
  const prevPageRef = useRef(currentPage)

  useEffect(() => {
    if (prevPageRef.current !== currentPage && contentRef.current) {
      const tl = gsap.timeline()
      const items = contentRef.current.children

      tl.to(items, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        stagger: 0.03,
        ease: "power1.out",
      }).fromTo(
        items,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power1.out" }
      )

      prevPageRef.current = currentPage
    }
  }, [currentPage])

  return (
    <section className="px-2 md:px-4 py-2 bg-[#ffffff1a] border border-white/10 rounded-xl">
      {/* Desktop: Title + Controls */}
      <div className="mb-4 hidden md:flex items-center justify-between ">
        <Title>{title}</Title>
        {totalPages > 1 && (
          <Controls {...{ currentPage, totalPages, setCurrentPage, className: "flex" }} />
        )}
      </div>

      {/* Mobile: Title Only */}
      <div className="mb-4 md:hidden">
        <Title>{title}</Title>
      </div>

      <div
        ref={contentRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3"
        dir={title === "ريفيوهات المشاهدين" ? "ltr" : "rtl"}
      >
        {children}
      </div>

      {/* Mobile: Controls*/}
      {totalPages > 1 && (
        <Controls {...{ currentPage, totalPages, setCurrentPage, className: "flex md:hidden justify-center mt-2" }} />
      )}
    </section>
  )
}

function Controls({
  currentPage,
  totalPages,
  setCurrentPage,
  className = "",
}: {
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
  className?: string
}) {
  return (
    <div className={`items-center gap-2 text-xs text-white/60 ${className}`}>
      <button
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="السابق"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <span className="select-none tracking-wide text-white/80">
        {currentPage} من {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="التالي"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    </div>
  )
}
