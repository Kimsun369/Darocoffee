interface FooterProps {
  language: "en" | "kh"
}

export function Footer({ language }: FooterProps) {
  return (
    <footer className="bg-amber-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-amber-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">☕</span>
              </div>
              <span className="font-signature text-2xl font-bold text-amber-100">Daro's Coffee</span>
            </div>
            <p className="text-amber-200 mb-4 leading-relaxed">
              {language === "en"
                ? "Experience the finest coffee crafted with passion and served with love. Your perfect cup awaits at Daro's Coffee."
                : "ជួបជាមួយកាហ្វេដ៏ល្អបំផុតដែលបង្កើតដោយចំណង់ចំណូលចិត្ត និងបម្រើដោយស្នេហា។ ពែងកាហ្វេដ៏ល្អឥតខ្ចោះរបស់អ្នកកំពុងរង់ចាំនៅ Daro's Coffee។"}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-amber-100">
              {language === "en" ? "Contact Us" : "ទាក់ទងយើង"}
            </h3>
            <div className="space-y-3 text-amber-200">
              <div className="flex items-start space-x-2">
                <span className="text-amber-400 mt-1">📍</span>
                <div>
                  <p className="text-sm">
                    {language === "en" ? "123 Coffee Street, Phnom Penh, Cambodia" : "ផ្លូវកាហ្វេ ១២៣, ភ្នំពេញ, កម្ពុជា"}
                  </p>
                </div>
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
          <div>
            <h3 className="font-semibold text-lg mb-4 text-amber-100">
              {language === "en" ? "Opening Hours" : "ម៉ោងបើក"}
            </h3>
            <div className="space-y-2 text-amber-200 text-sm">
              <div className="flex justify-between">
                <span>{language === "en" ? "Mon - Fri" : "ច័ន្ទ - សុក្រ"}</span>
                <span>6:00 AM - 9:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>{language === "en" ? "Saturday" : "សៅរ៍"}</span>
                <span>7:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>{language === "en" ? "Sunday" : "អាទិត្យ"}</span>
                <span>7:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-amber-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-amber-300 text-sm">
            {language === "en" ? "© 2025 Daro's Coffee. All rights reserved." : "© ២០២៥ Daro's Coffee។ រក្សាសិទ្ធិគ្រប់យ៉ាង។"}
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="text-amber-400 hover:text-amber-200 cursor-pointer">📘</span>
            <span className="text-amber-400 hover:text-amber-200 cursor-pointer">📷</span>
            <span className="text-amber-400 hover:text-amber-200 cursor-pointer">🐦</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
