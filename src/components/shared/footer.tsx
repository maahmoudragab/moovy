import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* اسم الموقع */}
        <div className="text-3xl font-extrabold text-[#f0b100] select-none cursor-default">
          Moovy
        </div>

        {/* روابط */}
        <nav className="flex gap-8 text-sm md:text-base">
          <a href="#" className="hover:text-[#f0b100] transition-colors duration-300">من نحن</a>
          <a href="#" className="hover:text-[#f0b100] transition-colors duration-300">سياسة الخصوصية</a>
          <a href="#" className="hover:text-[#f0b100] transition-colors duration-300">اتصل بنا</a>
        </nav>

        {/* سوشيال ميديا بأيقونات lucide-react */}
        <div className="flex gap-6 text-[#f0b100]">
          <a href="#" aria-label="Facebook" className="hover:text-white transition-colors duration-300">
            <Facebook size={24} />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-white transition-colors duration-300">
            <Twitter size={24} />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-white transition-colors duration-300">
            <Instagram size={24} />
          </a>
        </div>
      </div>

      <p className="text-center text-gray-400 text-xs mt-8 select-none">
        © 2025 Moovy. كل الحقوق محفوظة.
      </p>
    </footer>
  );
}
