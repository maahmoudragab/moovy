"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Home, Film, Tv, Clock, Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";

const iconSize = "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7";

const navLinks = [
  { label: "الرئيسية", icon: Home, path: "/" },
  { label: "الأحدث", icon: Clock, path: "/latest" },
  { label: "الأفلام", icon: Film, path: "/movies" },
  { label: "المسلسلات", icon: Tv, path: "/tv" },
  { label: "البرامج", icon: Clapperboard, path: "/shows" },
];

export default function Navbar() {
  const [showInput, setShowInput] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (showInput && inputRef.current) inputRef.current.focus();
  }, [showInput]);

  useEffect(() => {
    const closeInput = () => setShowInput(false);
    if (showInput) window.addEventListener("click", closeInput);
    return () => window.removeEventListener("click", closeInput);
  }, [showInput]);

  const handleClickInside = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();
  const handleSearch = () => {
    if (query.trim()) router.push(`/search?query=${encodeURIComponent(query)}`);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const renderDesktopLinks = () =>
    navLinks.map((link, i) => (
      <li
        key={i}
        className="cursor-pointer hover:text-primary duration-200 text-sm xl:text-base"
        onClick={() => router.push(link.path)}
      >
        {link.label}
      </li>
    ));

  const renderMobileLinks = () =>
    navLinks.map((link, i) => (
      <li
        key={i}
        onClick={() => router.push(link.path)}
        className="flex flex-col items-center justify-center gap-0.5 text-[10px] sm:text-xs hover:text-primary duration-200 cursor-pointer"
      >
        <link.icon className={iconSize} />
        <span>{link.label}</span>
      </li>
    ));


  return (
    <>
      {/* ✅ Desktop Navbar */}
      <header
        onClick={handleClickInside}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-50 hidden md:flex w-[95%] max-w-7xl h-16 px-6 justify-between items-center rounded-full border-2 backdrop-blur-xl bg-black/20 shadow-md"
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-sm">
            تسجيل دخول
          </Button>

          <div className="relative">
            <div
              className={`transition-all duration-300 transform overflow-hidden ${showInput
                ? "opacity-100 translate-x-0 md:w-30 lg:w-60 xl:w-90"
                : "opacity-0 w-0"
                }`}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="بتدور على ايه..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full border-2 py-1 px-3 pr-10 rounded-full bg-white/10 outline-none"
              />
            </div>
            <Button
              className="absolute top-0 right-0"
              size="icon"
              variant="icon"
              onClick={() => {
                if (showInput) handleSearch();
                else setShowInput(true);
              }}
            >
              <Search className={iconSize} />
            </Button>
          </div>
        </div>

        <ul className="flex items-center gap-5">{renderDesktopLinks()}</ul>

        <Image
          src="/images/moovy.webp" alt="logo" width={80} height={80} priority unoptimized className="cursor-pointer"
          onClick={() => router.push("/")} />
      </header>

      {/* ✅ Mobile Top Navbar */}
      <header className="md:hidden fixed  w-full px-2 h-13 bg-black/50 rounded-b-xl flex items-center justify-between z-50">
        <Image src="/images/moovy.webp" alt="logo" width={60} height={60} unoptimized onClick={() => router.push(`/`)} />
        <div className="flex gap-2 items-center">
          <Button variant="icon" size="icon" className="text-xs"
            onClick={(e) => {
              e.stopPropagation();
              if (showInput) handleSearch();
              else setShowInput(true);
            }}>
            <Search />
          </Button>
          <Button variant="default" size="sm" className="text-xs">
            تسجيل دخول
          </Button>
        </div>
      </header>

      {/* ✅ Mobile Search Input */}
      <div className={`md:hidden fixed top-11 left-0 w-full z-40 px-4 py-2 transition-all duration-300 ease-in-out transform ${showInput
        ? "opacity-100 translate-y-0 pointer-events-auto"
        : "opacity-0 -translate-y-4 pointer-events-none"
        }`} >
        <input
          ref={inputRef}
          type="text"
          placeholder="بتدور على ايه..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-10 border-white/20 py-2 px-4 text-white outline-none rounded-full border-2 backdrop-blur-xl shadow-md bg-black/20"
        />
      </div>

      {/* ✅ Mobile Bottom Navbar */}
      <ul className="md:hidden fixed bottom-0 left-0 w-full px-2 py-1 backdrop-blur-xl bg-black/20 rounded-t-xl border-t-2 flex items-center justify-around z-50">
        {renderMobileLinks()}
      </ul>
    </>
  );
}
