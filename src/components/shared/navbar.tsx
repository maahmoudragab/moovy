"use client"
import type React from "react"
// React & Next
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
// Firebase
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/firebase/firebaseConfig"
import { logoutUser, getUserProfile } from "@/firebase/authActions"
// UI Components
import { Button } from "@/components/ui/button"
import { Search, Home, Film, Tv, Clock } from "lucide-react"

const iconSize = "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"

const navLinks = [
  { label: "الرئيسية", icon: Home, path: "/" },
  { label: "الأحدث", icon: Clock, path: "/section/latest" },
  { label: "الأفلام", icon: Film, path: "/section/popular_movies" },
  { label: "المسلسلات", icon: Tv, path: "/section/popular_series" },
]

export default function Navbar() {
  const [showInput, setShowInput] = useState(false)
  const [query, setQuery] = useState("")
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // ================================
  // 🔐 Authentication Handler
  // ================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true)
      if (firebaseUser) {
        setUser(firebaseUser)
        const userProfile = await getUserProfile(firebaseUser.uid)

        setProfile(userProfile)
      } else {
        setUser(null)
        setProfile(null)
      }
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await logoutUser()
    setUser(null)
    setProfile(null)
  }

  // ================================
  // 🔍 Search Logic
  // ================================
  useEffect(() => {
    if (showInput && inputRef.current) {
      // إضافة delay ليتم الـ focus بعد انتهاء الـ CSS transition
      setTimeout(() => {
        inputRef.current?.focus()
      }, 350) // 350ms أكبر شوية من الـ transition duration (300ms)
    }
  }, [showInput])

  useEffect(() => {
    const closeInput = (e: MouseEvent) => {
      // Only close if clicking outside the search container
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowInput(false)
      }
    }

    if (showInput) {
      // Add a small delay before adding the listener to prevent immediate closure
      setTimeout(() => {
        window.addEventListener("click", closeInput)
      }, 100)
    }

    return () => window.removeEventListener("click", closeInput)
  }, [showInput])

  const handleClickInside = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()

  const handleSearch = () => {
    if (query.trim()) router.push(`/search?query=${encodeURIComponent(query)}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  const handleSearchButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling
    if (showInput) {
      handleSearch()
    } else {
      setShowInput(true)
    }
  }

  // ================================
  // ✅ Render Auth Section
  // ================================
  const renderAuthSection = (isMobile: boolean) => {

    if (isLoading) return null
    if (user) {
      if (!profile || Object.keys(profile).length <= 2) {
        return (
          <Button variant="outline" onClick={() => router.push("/auth/complate-profile")}>
            اكمال البيانات
          </Button>
        );

      }
    }

    if (user && profile && Object.keys(profile).length > 2) {
      return (
        <Image
          src={user.photoURL || "/images/default-avatar.png"}
          alt="User Avatar"
          width={36}
          height={36}
          unoptimized
          className="w-[36px] h-[36px] rounded-full cursor-pointer"
          onClick={() => router.push("/profile")}
        />
      );
    }

    return (
      <Button
        variant="outline"
        className={`${isMobile ? "text-xs" : "text-sm"} bg-transparent`}
        onClick={() => router.push(`/auth/login`)}
      >
        تسجيل دخول
      </Button>
    );

  }

  // ================================
  // 🧩 Render Navigation Links
  // ================================
  const renderDesktopLinks = () =>
    navLinks.map((link, i) => (
      <li
        key={i}
        className="cursor-pointer hover:text-primary duration-200 text-sm xl:text-base"
        onClick={() => router.push(link.path)}
      >
        {link.label}
      </li>
    ))

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
    ))

  // ================================
  // 📦 JSX Return
  // ================================
  return (
    <>
      {/* ✅ Desktop Navbar */}
      <header
        onClick={handleClickInside}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-50 hidden md:flex w-[95%] max-w-7xl h-15 px-6 justify-between items-center rounded-full border-2 backdrop-blur-xl bg-white/10 shadow-md"
      >
        <div className="flex items-center gap-2">
          {renderAuthSection(false)}
          {/* 🔍 Desktop Search */}
          <div className="relative" ref={searchContainerRef}>
            <div
              className={`transition-all duration-300 transform overflow-hidden ${showInput ? "opacity-100 translate-x-0 md:w-50 lg:w-80 xl:w-120" : "opacity-0 w-0"
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
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <Button className="absolute top-0 right-0" size="icon" variant="icon" onClick={handleSearchButtonClick}>
              <Search className={iconSize} />
            </Button>
          </div>
        </div>
        <ul className="flex items-center gap-5">{renderDesktopLinks()}</ul>
        <Image
          src="/images/moovy.webp"
          alt="logo"
          width={80}
          height={80}
          priority
          unoptimized
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
      </header>

      {/* ✅ Mobile Top Navbar */}
      <header className="md:hidden fixed w-full px-2 h-13 bg-gradient-to-b from-black/80 to-transparent rounded-b-xl flex items-center justify-between z-50">
        <Image
          src="/images/moovy.webp"
          alt="logo"
          width={60}
          height={60}
          unoptimized
          onClick={() => router.push(`/`)}
        />
        <div className="flex gap-2 items-center">
          <Button
            variant="icon"
            size="icon"
            className="text-xs"
            onClick={(e) => {
              e.stopPropagation()
              if (showInput) handleSearch()
              else setShowInput(true)
            }}
          >
            <Search />
          </Button>
          {renderAuthSection(true)}
        </div>
      </header>

      {/* ✅ Mobile Search Input */}
      <div
        className={`md:hidden fixed top-11 left-0 w-full z-40 px-4 py-2 transition-all duration-300 ease-in-out transform ${showInput ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
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
      <div className="md:hidden fixed bottom-2 left-0 w-full px-4 z-50">
        <ul className="w-full py-1  backdrop-blur-md bg-white/10 rounded-full border-2 flex items-center justify-around">
          {renderMobileLinks()}
        </ul>
      </div>
    </>
  )
}
