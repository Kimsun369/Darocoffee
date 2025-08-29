import { Map } from "./Map"

interface FooterProps {
  language: "en" | "kh"
}

export function Footer({ language }: FooterProps) {
  return (
    <footer className="bg-amber-900 text-white py-12 px-4 border-t-4 border-amber-600">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-amber-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">☕</span>
              </div>
              <span className="font-serif text-2xl font-bold text-white">Daro's Coffee</span>
            </div>
            <p className="text-amber-200 mb-4 leading-relaxed max-w-md">
              {language === "en"
                ? "Experience the finest coffee crafted with passion and served with love. Your perfect cup awaits at Daro's Coffee."
                : "ជួបជាមួយកាហ្វេដ៏ល្អបំផុតដែលបង្កើតដោយចំណង់ចំណូលចិត្ត និងបម្រើដោយស្នេហា។ ពែងកាហ្វេដ៏ល្អឥតខ្ចោះរបស់អ្នកកំពុងរង់ចាំនៅ Daro's Coffee។"}
            </p>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-3 h-[300px] rounded-xl overflow-hidden border-4 border-amber-600/30">
            <Map center={[11.5564, 104.9282]} />
          </div>

          {/* Contact Info */}
          <div className="border-l-4 border-amber-600 pl-4">
            <h3 className="font-semibold text-lg mb-4 text-white">{language === "en" ? "Contact Us" : "ទាក់ទងយើង"}</h3>
            <div className="space-y-3 text-amber-200">
              <div className="flex items-start space-x-2">
                <span className="text-amber-400 mt-1">📍</span>
                <p className="text-sm">
                  {language === "en" ? "123 Coffee Street, Phnom Penh, Cambodia" : "ផ្លូវកាហ្វេ ១២៣, ភ្នំពេញ, កម្ពុជា"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-amber-400">📞</span>
                <p className="text-sm">+855 12 345 678</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-amber-400">✉️</span>
                <p className="text-sm">hello@daroscoffee.com</p>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="border-l-4 border-amber-600 pl-4">
            <h3 className="font-semibold text-lg mb-4 text-white">{language === "en" ? "Opening Hours" : "ម៉ោងបើក"}</h3>
            <div className="space-y-2 text-amber-200 text-sm">
              <div className="flex justify-between">
                <span>{language === "en" ? "Mon - Fri" : "ច័ន្ទ - សុក្រ"}</span>
                <span className="text-white font-medium">6:00 AM - 9:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>{language === "en" ? "Saturday" : "សៅរ៍"}</span>
                <span className="text-white font-medium">7:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>{language === "en" ? "Sunday" : "អាទិត្យ"}</span>
                <span className="text-white font-medium">7:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-amber-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-amber-300 text-sm">
            {language === "en" ? "© 2025 Daro's Coffee. All rights reserved." : "© ២០២៥ Daro's Coffee។ រក្សាសិទ្ធិគ្រប់យ៉ាង។"}
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="text-amber-400 hover:text-amber-200 cursor-pointer text-xl">📘</span>
            <span className="text-amber-400 hover:text-amber-200 cursor-pointer text-xl">📷</span>
            <span className="text-amber-400 hover:text-amber-200 cursor-pointer text-xl">🐦</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
