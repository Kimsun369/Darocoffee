import { Map } from './Map';
import { IoLogoInstagram, IoLogoFacebook, IoLogoTwitter } from 'react-icons/io5';

interface FooterProps {
  language: "en" | "kh"
}

export function Footer({ language }: FooterProps) {
  return (
    <footer className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white py-16 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/30">
                <span className="text-white font-bold text-xl">☕</span>
              </div>
              <span className="font-serif text-3xl font-bold text-amber-100 drop-shadow-sm">Daro's Coffee</span>
            </div>
            <p className="text-amber-200/90 mb-6 leading-relaxed text-lg max-w-md">
              {language === "en"
                ? "Experience the finest coffee crafted with passion and served with love. Your perfect cup awaits at Daro's Coffee."
                : "ជួបជាមួយកាហ្វេដ៏ល្អបំផុតដែលបង្កើតដោយចំណង់ចំណូលចិត្ត និងបម្រើដោយស្នេហា។ ពែងកាហ្វេដ៏ល្អឥតខ្ចោះរបស់អ្នកកំពុងរង់ចាំនៅ Daro's Coffee។"}
            </p>
          </div>

          {/* Map and Contact Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-amber-700/30 shadow-lg h-[300px]">
              <Map center={[11.5564, 104.9282]} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Info */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-amber-700/30 shadow-lg">
                <h3 className="font-semibold text-xl mb-6 text-amber-100 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full mr-3"></div>
                  {language === "en" ? "Contact Us" : "ទាក់ទងយើង"}
                </h3>
                <div className="space-y-4 text-amber-200/90">
                  <div className="flex items-start space-x-3 group hover:text-amber-100 transition-colors duration-300">
                    <span className="text-amber-400 mt-1 text-lg group-hover:scale-110 transition-transform duration-300">
                      📍
                    </span>
                    <div>
                      <p className="text-sm leading-relaxed">
                        {language === "en" ? "123 Coffee Street, Phnom Penh, Cambodia" : "ផ្លូវកាហ្វេ ១២៣, ភ្នំពេញ, កម្ពុជា"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 group hover:text-amber-100 transition-colors duration-300">
                    <span className="text-amber-400 text-lg group-hover:scale-110 transition-transform duration-300">
                      📞
                    </span>
                    <p className="text-sm font-medium">+855 12 345 678</p>
                  </div>
                  <div className="flex items-center space-x-3 group hover:text-amber-100 transition-colors duration-300">
                    <span className="text-amber-400 text-lg group-hover:scale-110 transition-transform duration-300">
                      ✉️
                    </span>
                    <p className="text-sm font-medium">hello@daroscoffee.com</p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-amber-700/30 shadow-lg">
                <h3 className="font-semibold text-xl mb-6 text-amber-100 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full mr-3"></div>
                  {language === "en" ? "Opening Hours" : "ម៉ោងបើក"}
                </h3>
                <div className="space-y-3 text-amber-200/90 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-amber-700/20">
                    <span className="font-medium">{language === "en" ? "Mon - Fri" : "ច័ន្ទ - សុក្រ"}</span>
                    <span className="text-amber-100 font-semibold">6:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-amber-700/20">
                    <span className="font-medium">{language === "en" ? "Saturday" : "សៅរ៍"}</span>
                    <span className="text-amber-100 font-semibold">7:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">{language === "en" ? "Sunday" : "អាទិត្យ"}</span>
                    <span className="text-amber-100 font-semibold">7:00 AM - 8:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-amber-700/30 shadow-lg">
            <h3 className="font-semibold text-xl mb-6 text-amber-100 flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full mr-3"></div>
              {language === "en" ? "Stay Connected" : "បន្តភ្ជាប់ទំនាក់ទំនង"}
            </h3>
            <p className="text-amber-200/90 text-sm mb-4">
              {language === "en" 
                ? "Subscribe to our newsletter for updates and exclusive offers!" 
                : "ចុះឈ្មោះដើម្បីទទួលបានព័ត៌មានថ្មីៗ និងការផ្តល់ជូនពិសេស!"}
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder={language === "en" ? "Your email" : "អ៊ីមែលរបស់អ្នក"}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-amber-700/30 focus:outline-none focus:border-amber-400 text-amber-100 placeholder-amber-300/50"
              />
              <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium transition-all duration-300">
                {language === "en" ? "Subscribe" : "ចុះឈ្មោះ"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-amber-700/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-amber-300/90 text-sm font-medium">
            {language === "en" ? "© 2025 Daro's Coffee. All rights reserved." : "© ២០២៥ Daro's Coffee។ រក្សាសិទ្ធិគ្រប់យ៉ាង។"}
          </p>
          <div className="flex space-x-6 mt-6 md:mt-0">
            <IoLogoFacebook className="text-amber-400 hover:text-amber-200 cursor-pointer text-2xl hover:scale-110 transition-all duration-300" />
            <IoLogoInstagram className="text-amber-400 hover:text-amber-200 cursor-pointer text-2xl hover:scale-110 transition-all duration-300" />
            <IoLogoTwitter className="text-amber-400 hover:text-amber-200 cursor-pointer text-2xl hover:scale-110 transition-all duration-300" />
          </div>
        </div>
      </div>
    </footer>
  )
}
