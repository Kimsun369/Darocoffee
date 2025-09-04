import dynamic from "next/dynamic"
import { IoLogoInstagram, IoLogoFacebook, IoLogoTwitter } from "react-icons/io5"

// Dynamically import Map with SSR disabled and use named export
const Map = dynamic(() => import("./Map").then(mod => mod.Map), { ssr: false })

interface FooterProps {
  language: "en" | "kh"
}

export function Footer({ language }: FooterProps) {
  return (
    <footer className="bg-slate-800 text-white py-8 md:py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8 md:mb-12 space-y-6 lg:space-y-0">
          {/* Company Info */}
          <div className="w-full lg:w-auto">
            <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-amber-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl">☕</span>
              </div>
              <span className="font-serif text-2xl md:text-3xl font-bold text-white">Daro's Coffee</span>
            </div>
            <p className="text-gray-300 text-base md:text-lg font-sans">hello@daroscoffee.com</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 w-full lg:w-auto">
            <div className="flex items-start space-x-3">
              <span className="text-amber-500 mt-1 text-lg">🇰🇭</span>
              <div>
                <h4 className="text-white font-semibold mb-1 font-sans">Cambodia</h4>
                <p className="text-gray-300 text-sm font-sans">123 Coffee Street,</p>
                <p className="text-gray-300 text-sm font-sans">Phnom Penh, Cambodia</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-amber-500 mt-1 text-lg">📞</span>
              <div>
                <h4 className="text-white font-semibold mb-1 font-sans">Contact</h4>
                <p className="text-gray-300 text-sm font-sans">+855 12 345 678</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* About Column */}
          <div className="sm:col-span-1">
            <h3
              className={`text-gray-400 font-semibold text-sm uppercase tracking-wider mb-4 md:mb-6 ${language === "kh" ? "font-mono" : "font-sans"}`}
            >
              {language === "en" ? "About" : "អំពី"}
            </h3>
            <div className="space-y-2 md:space-y-3">
              <a
                href="#"
                className={`block text-white hover:text-amber-400 transition-colors text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
              >
                {language === "en" ? "Our Story" : "រឿងរ៉ាវរបស់យើង"}
              </a>
              <a
                href="#"
                className={`block text-white hover:text-amber-400 transition-colors text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
              >
                {language === "en" ? "Our Coffee" : "កាហ្វេរបស់យើង"}
              </a>
              <a
                href="#"
                className={`block text-white hover:text-amber-400 transition-colors text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
              >
                {language === "en" ? "Sustainability" : "ចីរភាព"}
              </a>
              <a
                href="#"
                className={`block text-white hover:text-amber-400 transition-colors text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
              >
                {language === "en" ? "Careers" : "ការងារ"}
              </a>
            </div>
          </div>

          {/* Menu Column */}
          <div className="sm:col-span-1">
            <h3
              className={`text-gray-400 font-semibold text-sm uppercase tracking-wider mb-4 md:mb-6 ${language === "kh" ? "font-mono" : "font-sans"}`}
            >
              {language === "en" ? "Menu" : "ម៉ឺនុយ"}
            </h3>
            <div className="space-y-2 md:space-y-3">
              <a
                href="#"
                className={`block text-white hover:text-amber-400 transition-colors text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
              >
                {language === "en" ? "Coffee" : "កាហ្វេ"}
              </a>
              <a
                href="#"
                className={`block text-white hover:text-amber-400 transition-colors text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
              >
                {language === "en" ? "Tea" : "តែ"}
              </a>
              <a
                href="#"
                className={`block text-white hover:text-amber-400 transition-colors text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
              >
                {language === "en" ? "Pastries" : "នំ"}
              </a>
              <a
                href="#"
                className={`block text-white hover:text-amber-400 transition-colors text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
              >
                {language === "en" ? "Breakfast" : "អាហារពេលព្រឹក"}
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div className="sm:col-span-1">
            <h3
              className={`text-gray-400 font-semibold text-sm uppercase tracking-wider mb-4 md:mb-6 ${language === "kh" ? "font-mono" : "font-sans"}`}
            >
              {language === "en" ? "Services" : "សេវាកម្ម"}
            </h3>
            <div className="space-y-2 md:space-y-3">
              <a
                href="#"
                className={`block text-white hover:text-amber-400 transition-colors text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
              >
                {language === "en" ? "Catering" : "ការផ្គត់ផ្គង់"}
              </a>
              <a
                href="#"
                className={`block text-white hover:text-amber-400 transition-colors text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
              >
                {language === "en" ? "Events" : "ព្រឹត្តិការណ៍"}
              </a>
              <a
                href="#"
                className={`block text-white hover:text-amber-400 transition-colors text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
              >
                {language === "en" ? "Private Parties" : "ពិធីជប់លៀងឯកជន"}
              </a>
              <a
                href="#"
                className={`block text-white hover:text-amber-400 transition-colors text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
              >
                {language === "en" ? "Corporate Orders" : "ការបញ្ជាទិញក្រុមហ៊ុន"}
              </a>
            </div>
          </div>

          {/* Hours Column */}
          <div className="sm:col-span-1">
            <h3
              className={`text-gray-400 font-semibold text-sm uppercase tracking-wider mb-4 md:mb-6 ${language === "kh" ? "font-mono" : "font-sans"}`}
            >
              {language === "en" ? "Hours" : "ម៉ោងបើក"}
            </h3>
            <div className="space-y-2 md:space-y-3 text-sm">
              <div>
                <p className={`text-white font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>
                  {language === "en" ? "Mon - Fri" : "ច័ន្ទ - សុក្រ"}
                </p>
                <p className="text-gray-300 font-sans">6:00 AM - 9:00 PM</p>
              </div>
              <div>
                <p className={`text-white font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>
                  {language === "en" ? "Saturday" : "សៅរ៍"}
                </p>
                <p className="text-gray-300 font-sans">7:00 AM - 10:00 PM</p>
              </div>
              <div>
                <p className={`text-white font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>
                  {language === "en" ? "Sunday" : "អាទិត្យ"}
                </p>
                <p className="text-gray-300 font-sans">7:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3
              className={`text-gray-400 font-semibold text-sm uppercase tracking-wider mb-4 md:mb-6 ${language === "kh" ? "font-mono" : "font-sans"}`}
            >
              {language === "en" ? "Newsletter" : "ព័ត៌មានថ្មី"}
            </h3>
            <p className={`text-gray-300 text-sm mb-4 ${language === "kh" ? "font-mono" : "font-sans"}`}>
              {language === "en" ? "Subscribe for updates and exclusive offers!" : "ចុះឈ្មោះដើម្បីទទួលបានព័ត៌មានថ្មីៗ!"}
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder={language === "en" ? "Your email" : "អ៊ីមែលរបស់អ្នក"}
                className={`w-full px-3 py-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-amber-500 text-white placeholder-gray-400 text-sm ${language === "kh" ? "font-mono" : "font-sans"}`}
              />
              <button
                className={`w-full px-3 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-colors ${language === "kh" ? "font-mono" : "font-sans"}`}
              >
                {language === "en" ? "Subscribe" : "ចុះឈ្មោះ"}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8 md:mb-12">
          <div className="bg-slate-700 rounded-lg p-2 md:p-4 h-[200px] md:h-[300px]">
            <Map 
              center={[11.61616823412506, 104.90097788247442]} 
              locationName="My Coffee Shop" 
            />
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6 md:pt-8 flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
            <a
              href="#"
              className={`text-gray-300 hover:text-white text-sm transition-colors ${language === "kh" ? "font-mono" : "font-sans"}`}
            >
              {language === "en" ? "Privacy Policy" : "គោលការណ៍ភាពឯកជន"}
            </a>
            <a
              href="#"
              className={`text-gray-300 hover:text-white text-sm transition-colors ${language === "kh" ? "font-mono" : "font-sans"}`}
            >
              {language === "en" ? "Terms of Service" : "លក្ខខណ្ឌសេវាកម្ម"}
            </a>
            <a
              href="#"
              className={`text-gray-300 hover:text-white text-sm transition-colors ${language === "kh" ? "font-mono" : "font-sans"}`}
            >
              {language === "en" ? "Contact" : "ទាក់ទង"}
            </a>
          </div>

          <p
            className={`text-gray-400 text-sm text-center order-last md:order-none ${language === "kh" ? "font-mono" : "font-sans"}`}
          >
            {language === "en" ? "© 2025 Daro's Coffee, All rights reserved" : "© ២០២៥ Daro's Coffee។ រក្សាសិទ្ធិគ្រប់យ៉ាង។"}
          </p>

          <div className="flex space-x-4 justify-center md:justify-end">
            <IoLogoFacebook className="text-gray-400 hover:text-amber-400 cursor-pointer text-xl transition-colors" />
            <IoLogoInstagram className="text-gray-400 hover:text-amber-400 cursor-pointer text-xl transition-colors" />
            <IoLogoTwitter className="text-gray-400 hover:text-amber-400 cursor-pointer text-xl transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  )
}
