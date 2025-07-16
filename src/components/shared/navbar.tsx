"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Home, Film, Tv, Clock, Clapperboard } from "lucide-react";
import { Button } from "../ui/button";


const iconSize = "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7";
// Navbar Links
const navLinks = [
  { label: "الرئيسيه", icon: <Home className={iconSize} /> },
  { label: "الاحدث", icon: <Clock className={iconSize} /> },
  { label: "الافلام", icon: <Film className={iconSize} /> },
  { label: "المسلسلات", icon: <Tv className={iconSize} /> },
  { label: "البرامج", icon: <Clapperboard className={iconSize} /> },
];

export default function Navbar() {
  const [showInput, setShowInput] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // فوكس تلقائي عند فتح الإنپوت
  useEffect(() => {
    if (showInput && inputRef.current) inputRef.current.focus();
  }, [showInput]);

  // إغلاق الإنپوت عند الضغط برا
  useEffect(() => {
    const handleClickOutside = () => setShowInput(false);
    if (showInput) window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [showInput]);

  // منع قفل الإنپوت عند الضغط جواه
  const handleClickInside = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();

  // تنفيذ البحث
  const handleSearch = () => {
    if (query.trim()) router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  // بحث عند الضغط Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // لينكات الديسكتوب
  const desktopLinks = navLinks.map((link, i) => (
    <li key={i} className="cursor-pointer duration-200 hover:text-primary text-sm xl:text-base">{link.label}</li>
  ));

  // لينكات الموبايل
  const mobileLinks = navLinks.map((link, i) => (
    <li key={i} className="flex flex-col items-center justify-center gap-1 text-xs sm:text-sm hover:text-primary duration-300 cursor-pointer">
      {link.icon}
      <span>{link.label}</span>
    </li>
  ));

  return (
    <>
      {/* Desktop Navbar */}
      <div onClick={handleClickInside}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-50 hidden md:flex w-[95%] max-w-7xl h-16 px-6 justify-between items-center rounded-full border-2 backdrop-blur-xl shadow-md bg-white/10" >
        {/* Login Btn + Search Input*/}
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-sm">تسجيل دخول</Button>
          <div className="relative">
            <div className={`transition-all duration-300 transform ${showInput ? "opacity-100 translate-x-0 md:w-30 lg:w-60 xl:w-90" : "opacity-0 w-0"} overflow-hidden`} >
              <input ref={inputRef} type="text" placeholder="بتدور على ايه..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
                className="w-full border-2 py-1 px-3 pr-10 rounded-full bg-white/10 outline-none" />
            </div>
            <Button className="absolute top-0 right-0" size="icon" variant="icon"
              onClick={() => { if (showInput) { handleSearch(); } else { setShowInput(true); } }} >
              <Search className={iconSize} />
            </Button>
          </div>
        </div>

        {/* links*/}
        <ul className="flex items-center gap-6">{desktopLinks}</ul>

        {/* logo */}
        <Image src="/images/moovy.webp" alt="logo" width={80} height={80} unoptimized className="cursor-pointer" />
      </div>

      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 w-full h-14 px-4 flex items-center justify-between z-50 ">
        <Image src="/images/moovy.webp" alt="logo" width={70} height={70} unoptimized />
        <div className="flex gap-2 items-center">
          <Button size="icon" variant="icon"
            onClick={(e) => {
              e.stopPropagation()
              if (showInput) { handleSearch() } else { setShowInput(true) }
            }}>
            <Search className={iconSize} />
          </Button>
          <Button variant="outline" className="text-xs px-2">تسجيل دخول</Button>
        </div>
      </div>

      {/* ✅ Mobile Search Input */}
      <div className={`md:hidden fixed top-12 left-0 w-full z-40 px-4 py-2 transition-all duration-300 ease-in-out transform ${showInput ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"}`} >
        <input ref={inputRef} type="text" placeholder="بتدور على ايه..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
          className="w-full border h-10 border-white/20 py-2 px-4 rounded-full bg-white/10 text-white outline-none" />
      </div>

      {/* ✅ Mobile Bottom Navbar */}
      <ul className="md:hidden fixed bottom-0 left-0 w-full px-4 py-2 backdrop-blur-xl rounded-t-xl border-t-2 flex items-center justify-between z-50">
        {mobileLinks}
      </ul>
    </>
  );
}
