import dynamic from "next/dynamic"
import { IoLogoInstagram, IoLogoFacebook, IoLogoTwitter } from "react-icons/io5"
import { FOOTER_CONFIG, getTranslatedText } from "@/config/footer-config"

// Dynamically import Map with SSR disabled and use named export
const Map = dynamic(() => import("./Map").then((mod) => mod.Map), { ssr: false })

interface FooterProps {
  language: "en" | "kh"
}

export function Footer({ language }: FooterProps) {
  const SocialIcon = ({ iconName }: { iconName: string }) => {
    switch (iconName) {
      case "IoLogoFacebook":
        return <IoLogoFacebook className="text-gray-400 hover:text-amber-400 cursor-pointer text-xl transition-colors bg-slate-700" />
      case "IoLogoInstagram":
        return <IoLogoInstagram className="text-gray-400 hover:text-amber-400 cursor-pointer text-xl transition-colors bg-slate-700" />
      case "IoLogoTwitter":
        return <IoLogoTwitter className="text-gray-400 hover:text-amber-400 cursor-pointer text-xl transition-colors bg-slate-700" />
      default:
        return null
    }
  }

  return (
    <footer className="bg-slate-700 text-white py-8 md:py-16 px-4">
      <div className="container mx-auto max-w-7xl bg-slate-700">
        <div className="bg-slate-700 flex flex-col lg:flex-row justify-between items-start space-y-6 lg:space-y-0">
          {/* Company Info */}
          <div className="w-full lg:w-auto bg-slate-700">
            <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4 bg-slate-700">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-slate-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl bg-slate-700">
                  {FOOTER_CONFIG.COMPANY.LOGO}
                </span>
              </div>
              <span className="font-serif text-2xl md:text-3xl font-bold text-white bg-slate-700">
                {FOOTER_CONFIG.COMPANY.NAME}
              </span>
            </div>
            <p className="text-gray-300 text-base md:text-lg font-sans bg-slate-700">
              {FOOTER_CONFIG.COMPANY.EMAIL}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 w-full lg:w-auto bg-slate-700">
            {FOOTER_CONFIG.LOCATIONS.map((location, index) => (
              <div key={index} className="flex items-start space-x-3 bg-slate-700">
                <span className="text-amber-500 mt-1 text-lg bg-slate-700">{location.countryEmoji}</span>
                <div className="bg-slate-700">
                  <h4 className="text-white font-semibold mb-1 font-sans bg-slate-700">{location.country}</h4>
                  <p className="text-gray-300 text-sm font-sans bg-slate-700">{location.address.line1}</p>
                  <p className="text-gray-300 text-sm font-sans bg-slate-700">{location.address.line2}</p>
                </div>
              </div>
            ))}
            <div className="flex items-start space-x-3 bg-slate-700">
              <span className="text-amber-500 mt-1 text-lg bg-slate-700">{FOOTER_CONFIG.CONTACT.phoneEmoji}</span>
              <div className="bg-slate-700">
                <h4 className="text-white font-semibold mb-1 font-sans bg-slate-700">
                  {getTranslatedText({ en: "Contact", kh: "ទំនាក់ទំនង" }, language)}
                </h4>
                <p className="text-gray-300 text-sm font-sans bg-slate-700">{FOOTER_CONFIG.CONTACT.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 bg-slate-700">
          {/* About Column */}
          <div className="sm:col-span-1 bg-slate-700">
            <h3 className={`text-gray-300 font-semibold text-sm uppercase tracking-wider mb-4 md:mb-6 bg-slate-700 ${language === "kh" ? "font-mono" : "font-sans"}`}>
              {getTranslatedText(FOOTER_CONFIG.LINKS.ABOUT.title, language)}
            </h3>
            <div className="space-y-2 md:space-y-3 bg-slate-700">
              {FOOTER_CONFIG.LINKS.ABOUT.items.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`block text-white hover:text-amber-400 transition-colors text-sm md:text-base bg-slate-700 ${language === "kh" ? "font-mono" : "font-sans"}`}
                >
                  {getTranslatedText(item, language)}
                </a>
              ))}
            </div>
          </div>

          {/* Menu Column */}
          <div className="sm:col-span-1 bg-slate-700">
            <h3 className={`text-gray-300 font-semibold text-sm uppercase tracking-wider mb-4 md:mb-6 bg-slate-700 ${language === "kh" ? "font-mono" : "font-sans"}`}>
              {getTranslatedText(FOOTER_CONFIG.LINKS.MENU.title, language)}
            </h3>
            <div className="space-y-2 md:space-y-3 bg-slate-700">
              {FOOTER_CONFIG.LINKS.MENU.items.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`block text-white hover:text-amber-400 transition-colors text-sm md:text-base bg-slate-700 ${language === "kh" ? "font-mono" : "font-sans"}`}
                >
                  {getTranslatedText(item, language)}
                </a>
              ))}
            </div>
          </div>

          {/* Services Column */}
          <div className="sm:col-span-1 bg-slate-700">
            <h3 className={`text-gray-300 font-semibold text-sm uppercase tracking-wider mb-4 md:mb-6 bg-slate-700 ${language === "kh" ? "font-mono" : "font-sans"}`}>
              {getTranslatedText(FOOTER_CONFIG.LINKS.SERVICES.title, language)}
            </h3>
            <div className="space-y-2 md:space-y-3 bg-slate-700">
              {FOOTER_CONFIG.LINKS.SERVICES.items.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`block text-white hover:text-amber-400 transition-colors text-sm md:text-base bg-slate-700 ${language === "kh" ? "font-mono" : "font-sans"}`}
                >
                  {getTranslatedText(item, language)}
                </a>
              ))}
            </div>
          </div>

          {/* Hours Column */}
          <div className="sm:col-span-1 bg-slate-700">
            <h3 className={`text-gray-300 font-semibold text-sm uppercase tracking-wider mb-4 md:mb-6 bg-slate-700 ${language === "kh" ? "font-mono" : "font-sans"}`}>
              {getTranslatedText(FOOTER_CONFIG.HOURS.title, language)}
            </h3>
            <div className="space-y-2 md:space-y-3 text-sm bg-slate-700">
              {FOOTER_CONFIG.HOURS.periods.map((period, index) => (
                <div key={index} className="bg-slate-700">
                  <p className={`text-white font-medium bg-slate-700 ${language === "kh" ? "font-mono" : "font-sans"}`}>
                    {getTranslatedText(period.days, language)}
                  </p>
                  <p className="text-gray-300 font-sans bg-slate-700">{period.hours}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="sm:col-span-2 md:col-span-1 bg-slate-700">
            <h3 className={`text-gray-300 font-semibold text-sm uppercase tracking-wider mb-4 md:mb-6 bg-slate-700 ${language === "kh" ? "font-mono" : "font-sans"}`}>
              {getTranslatedText(FOOTER_CONFIG.NEWSLETTER.title, language)}
            </h3>
            <p className={`text-gray-300 text-sm mb-4 bg-slate-700 ${language === "kh" ? "font-mono" : "font-sans"}`}>
              {getTranslatedText(FOOTER_CONFIG.NEWSLETTER.description, language)}
            </p>
            <div className="space-y-3 bg-slate-700">
              <input
                type="email"
                placeholder={getTranslatedText(FOOTER_CONFIG.NEWSLETTER.placeholder, language)}
                className={`w-full px-3 py-2 rounded bg-slate-600 border border-slate-500 focus:outline-none focus:border-amber-500 text-white placeholder-gray-400 text-sm ${language === "kh" ? "font-mono" : "font-sans"}`}
              />
              <button
                className={`w-full px-3 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-colors ${language === "kh" ? "font-mono" : "font-sans"}`}
              >
                {getTranslatedText(FOOTER_CONFIG.NEWSLETTER.button, language)}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3 bg-slate-700">
          <div className="bg-slate-700 rounded-lg p-2 h-[300px] md:h-[400px] relative z-10">
            <Map center={FOOTER_CONFIG.MAP.center} locationName={FOOTER_CONFIG.MAP.locationName} />
          </div>
        </div>

        <div className="border-t border-slate-600 pt-6 md:pt-8 flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center bg-slate-700">
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start bg-slate-700">
            {FOOTER_CONFIG.LEGAL.links.map((link, index) => (
              <a
                key={index}
                href="#"
                className={`text-gray-300 hover:text-amber-400 text-sm transition-colors bg-slate-700 ${language === "kh" ? "font-mono" : "font-sans"}`}
              >
                {getTranslatedText(link, language)}
              </a>
            ))}
          </div>

          <p className={`text-gray-400 text-sm text-center order-last md:order-none bg-slate-700 ${language === "kh" ? "font-mono" : "font-sans"}`}>
            {getTranslatedText(FOOTER_CONFIG.LEGAL.copyright, language)}
          </p>

          <div className="flex space-x-4 justify-center md:justify-end bg-slate-700">
            {FOOTER_CONFIG.SOCIAL_MEDIA.platforms.map((platform, index) => (
              <SocialIcon key={index} iconName={platform.icon} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}