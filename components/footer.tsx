import dynamic from "next/dynamic"
import { IoLogoInstagram, IoLogoFacebook, IoLogoTwitter } from "react-icons/io5"
import { FOOTER_CONFIG, getTranslatedText } from "@/config/footer-config"
import { COLORS } from "@/config/color-config"

// Dynamically import Map with SSR disabled and use named export
const Map = dynamic(() => import("./Map").then((mod) => mod.Map), { ssr: false })

interface FooterProps {
  language: "en" | "kh"
}

export function Footer({ language }: FooterProps) {
  const SocialIcon = ({ iconName }: { iconName: string }) => {
    const iconStyle = {
      color: COLORS.gray[400],
      backgroundColor: COLORS.gray[700]
    }

    const hoverStyle = {
      color: COLORS.primary[400],
      backgroundColor: COLORS.gray[700]
    }

    switch (iconName) {
      case "IoLogoFacebook":
        return (
          <IoLogoFacebook 
            className="cursor-pointer text-xl transition-colors" 
            style={iconStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = hoverStyle.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = iconStyle.color
            }}
          />
        )
      case "IoLogoInstagram":
        return (
          <IoLogoInstagram 
            className="cursor-pointer text-xl transition-colors" 
            style={iconStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = hoverStyle.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = iconStyle.color
            }}
          />
        )
      case "IoLogoTwitter":
        return (
          <IoLogoTwitter 
            className="cursor-pointer text-xl transition-colors" 
            style={iconStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = hoverStyle.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = iconStyle.color
            }}
          />
        )
      default:
        return null
    }
  }

  const footerStyle = {
    backgroundColor: COLORS.gray[700],
    color: COLORS.text.inverse
  }

  const textSecondaryStyle = {
    color: COLORS.gray[300]
  }

  const textTertiaryStyle = {
    color: COLORS.gray[400]
  }

  const accentStyle = {
    color: COLORS.primary[500]
  }

  const hoverAccentStyle = {
    color: COLORS.primary[400]
  }

  return (
    <footer 
      className="py-8 md:py-16 px-4"
      style={footerStyle}
    >
      <div className="container mx-auto max-w-7xl" style={footerStyle}>
        <div className="flex flex-col lg:flex-row justify-between items-start space-y-6 lg:space-y-0" style={footerStyle}>
          {/* Company Info */}
          <div className="w-full lg:w-auto" style={footerStyle}>
            <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4" style={footerStyle}>
              <div 
                className="h-10 w-10 md:h-12 md:w-12 rounded-lg flex items-center justify-center"
                style={footerStyle}
              >
                <span 
                  className="font-bold text-lg md:text-xl"
                  style={{ color: COLORS.text.inverse }}
                >
                  {FOOTER_CONFIG.COMPANY.LOGO}
                </span>
              </div>
              <span 
                className="font-serif text-2xl md:text-3xl font-bold"
                style={{ color: COLORS.text.inverse }}
              >
                {FOOTER_CONFIG.COMPANY.NAME}
              </span>
            </div>
            <p 
              className="text-base md:text-lg font-sans"
              style={textSecondaryStyle}
            >
              {FOOTER_CONFIG.COMPANY.EMAIL}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 w-full lg:w-auto" style={footerStyle}>
            {FOOTER_CONFIG.LOCATIONS.map((location, index) => (
              <div key={index} className="flex items-start space-x-3" style={footerStyle}>
                <span 
                  className="mt-1 text-lg"
                  style={accentStyle}
                >
                  {location.countryEmoji}
                </span>
                <div style={footerStyle}>
                  <h4 
                    className="font-semibold mb-1 font-sans"
                    style={{ color: COLORS.text.inverse }}
                  >
                    {location.country}
                  </h4>
                  <p 
                    className="text-sm font-sans"
                    style={textSecondaryStyle}
                  >
                    {location.address.line1}
                  </p>
                  <p 
                    className="text-sm font-sans"
                    style={textSecondaryStyle}
                  >
                    {location.address.line2}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex items-start space-x-3" style={footerStyle}>
              <span 
                className="mt-1 text-lg"
                style={accentStyle}
              >
                {FOOTER_CONFIG.CONTACT.phoneEmoji}
              </span>
              <div style={footerStyle}>
                <h4 
                  className="font-semibold mb-1 font-sans"
                  style={{ color: COLORS.text.inverse }}
                >
                  {getTranslatedText({ en: "Contact", kh: "ទំនាក់ទំនង" }, language)}
                </h4>
                <p 
                  className="text-sm font-sans"
                  style={textSecondaryStyle}
                >
                  {FOOTER_CONFIG.CONTACT.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8" style={footerStyle}>
          {/* About Column */}
          <div className="sm:col-span-1" style={footerStyle}>
            <h3 
              className={`font-semibold text-sm uppercase tracking-wider mb-4 md:mb-6 ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={textSecondaryStyle}
            >
              {getTranslatedText(FOOTER_CONFIG.LINKS.ABOUT.title, language)}
            </h3>
            <div className="space-y-2 md:space-y-3" style={footerStyle}>
              {FOOTER_CONFIG.LINKS.ABOUT.items.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`block transition-colors text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
                  style={{ color: COLORS.text.inverse }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = hoverAccentStyle.color
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = COLORS.text.inverse
                  }}
                >
                  {getTranslatedText(item, language)}
                </a>
              ))}
            </div>
          </div>

          {/* Menu Column */}
          <div className="sm:col-span-1" style={footerStyle}>
            <h3 
              className={`font-semibold text-sm uppercase tracking-wider mb-4 md:mb-6 ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={textSecondaryStyle}
            >
              {getTranslatedText(FOOTER_CONFIG.LINKS.MENU.title, language)}
            </h3>
            <div className="space-y-2 md:space-y-3" style={footerStyle}>
              {FOOTER_CONFIG.LINKS.MENU.items.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`block transition-colors text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
                  style={{ color: COLORS.text.inverse }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = hoverAccentStyle.color
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = COLORS.text.inverse
                  }}
                >
                  {getTranslatedText(item, language)}
                </a>
              ))}
            </div>
          </div>

          {/* Services Column */}
          <div className="sm:col-span-1" style={footerStyle}>
            <h3 
              className={`font-semibold text-sm uppercase tracking-wider mb-4 md:mb-6 ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={textSecondaryStyle}
            >
              {getTranslatedText(FOOTER_CONFIG.LINKS.SERVICES.title, language)}
            </h3>
            <div className="space-y-2 md:space-y-3" style={footerStyle}>
              {FOOTER_CONFIG.LINKS.SERVICES.items.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`block transition-colors text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
                  style={{ color: COLORS.text.inverse }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = hoverAccentStyle.color
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = COLORS.text.inverse
                  }}
                >
                  {getTranslatedText(item, language)}
                </a>
              ))}
            </div>
          </div>

          {/* Hours Column */}
          <div className="sm:col-span-1" style={footerStyle}>
            <h3 
              className={`font-semibold text-sm uppercase tracking-wider mb-4 md:mb-6 ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={textSecondaryStyle}
            >
              {getTranslatedText(FOOTER_CONFIG.HOURS.title, language)}
            </h3>
            <div className="space-y-2 md:space-y-3 text-sm" style={footerStyle}>
              {FOOTER_CONFIG.HOURS.periods.map((period, index) => (
                <div key={index} style={footerStyle}>
                  <p 
                    className={`font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}
                    style={{ color: COLORS.text.inverse }}
                  >
                    {getTranslatedText(period.days, language)}
                  </p>
                  <p 
                    className="font-sans"
                    style={textSecondaryStyle}
                  >
                    {period.hours}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="sm:col-span-2 md:col-span-1" style={footerStyle}>
            <h3 
              className={`font-semibold text-sm uppercase tracking-wider mb-4 md:mb-6 ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={textSecondaryStyle}
            >
              {getTranslatedText(FOOTER_CONFIG.NEWSLETTER.title, language)}
            </h3>
            <p 
              className={`text-sm mb-4 ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={textSecondaryStyle}
            >
              {getTranslatedText(FOOTER_CONFIG.NEWSLETTER.description, language)}
            </p>
            <div className="space-y-3" style={footerStyle}>
              <input
                type="email"
                placeholder={getTranslatedText(FOOTER_CONFIG.NEWSLETTER.placeholder, language)}
                className={`w-full px-3 py-2 rounded border focus:outline-none text-white placeholder-gray-400 text-sm ${language === "kh" ? "font-mono" : "font-sans"}`}
                style={{
                  backgroundColor: COLORS.gray[600],
                  borderColor: COLORS.gray[500],
                  color: COLORS.text.inverse
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COLORS.primary[500]
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = COLORS.gray[500]
                }}
              />
              <button
                className={`w-full px-3 py-2 rounded font-medium text-sm transition-colors ${language === "kh" ? "font-mono" : "font-sans"}`}
                style={{
                  backgroundColor: COLORS.primary[600],
                  color: COLORS.text.inverse
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.primary[700]
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.primary[600]
                }}
              >
                {getTranslatedText(FOOTER_CONFIG.NEWSLETTER.button, language)}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3" style={footerStyle}>
          <div 
            className="rounded-lg p-2 h-[300px] md:h-[400px] relative z-10"
            style={footerStyle}
          >
            <Map center={FOOTER_CONFIG.MAP.center} locationName={FOOTER_CONFIG.MAP.locationName} />
          </div>
        </div>

        <div 
          className="border-t pt-6 md:pt-8 flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center"
          style={{
            ...footerStyle,
            borderColor: COLORS.gray[600]
          }}
        >
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start" style={footerStyle}>
            {FOOTER_CONFIG.LEGAL.links.map((link, index) => (
              <a
                key={index}
                href="#"
                className={`text-sm transition-colors ${language === "kh" ? "font-mono" : "font-sans"}`}
                style={textSecondaryStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = hoverAccentStyle.color
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = textSecondaryStyle.color
                }}
              >
                {getTranslatedText(link, language)}
              </a>
            ))}
          </div>

          <p 
            className={`text-sm text-center order-last md:order-none ${language === "kh" ? "font-mono" : "font-sans"}`}
            style={textTertiaryStyle}
          >
            {getTranslatedText(FOOTER_CONFIG.LEGAL.copyright, language)}
          </p>

          <div className="flex space-x-4 justify-center md:justify-end" style={footerStyle}>
            {FOOTER_CONFIG.SOCIAL_MEDIA.platforms.map((platform, index) => (
              <SocialIcon key={index} iconName={platform.icon} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}