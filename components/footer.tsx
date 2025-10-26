"use client"

import type React from "react"

import dynamic from "next/dynamic"
import { IoLogoInstagram, IoLogoFacebook, IoLogoTwitter } from "react-icons/io5"
import { MapPin } from "lucide-react"
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
      color: COLORS.text.inverse,
      backgroundColor: "transparent",
    }

    const hoverStyle = {
      color: COLORS.primary[400],
    }

    const commonProps = {
      className: "cursor-pointer text-xl transition-all duration-200",
      style: iconStyle,
      onMouseEnter: (e: React.MouseEvent<SVGElement>) => {
        e.currentTarget.style.color = hoverStyle.color
        e.currentTarget.style.transform = "scale(1.2) translateY(-2px)"
      },
      onMouseLeave: (e: React.MouseEvent<SVGElement>) => {
        e.currentTarget.style.color = iconStyle.color
        e.currentTarget.style.transform = "scale(1) translateY(0)"
      },
    }

    switch (iconName) {
      case "IoLogoFacebook":
        return <IoLogoFacebook {...commonProps} />
      case "IoLogoInstagram":
        return <IoLogoInstagram {...commonProps} />
      case "IoLogoTwitter":
        return <IoLogoTwitter {...commonProps} />
      default:
        return null
    }
  }

  const footerStyle = {
    background: `linear-gradient(135deg, ${COLORS.primary[900]} 0%, ${COLORS.primary[800]} 100%)`,
    color: COLORS.text.inverse,
  }

  const textSecondaryStyle = {
    color: COLORS.gray[300],
  }

  const textTertiaryStyle = {
    color: COLORS.gray[400],
  }

  const accentStyle = {
    color: COLORS.primary[400],
  }

  const hoverAccentStyle = {
    color: COLORS.primary[300],
  }

  return (
    <footer className="py-8 md:py-16 px-4" style={footerStyle}>
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-start space-y-6 lg:space-y-0 mb-12">
          {/* Company Info */}
          <div className="w-full lg:w-auto">
            <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
              <div
                className="h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary[500]} 0%, ${COLORS.primary[700]} 100%)`,
                }}
              >
                <span className="font-bold text-lg md:text-xl" style={{ color: COLORS.text.inverse }}>
                  {FOOTER_CONFIG.COMPANY.LOGO}
                </span>
              </div>
              <span className="font-serif text-2xl md:text-3xl font-bold" style={{ color: COLORS.text.inverse }}>
                {FOOTER_CONFIG.COMPANY.NAME}
              </span>
            </div>
            <p className="text-base md:text-lg font-sans font-semibold" style={textSecondaryStyle}>
              {FOOTER_CONFIG.COMPANY.EMAIL}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 w-full lg:w-auto">
            {FOOTER_CONFIG.LOCATIONS.map((location, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="mt-1 text-lg" style={accentStyle}>
                  {location.countryEmoji}
                </span>
                <div>
                  <h4 className="font-bold mb-1 font-sans" style={{ color: COLORS.text.inverse }}>
                    {location.country}
                  </h4>
                  <p className="text-sm font-sans" style={textSecondaryStyle}>
                    {location.address.line1}
                  </p>
                  <p className="text-sm font-sans" style={textSecondaryStyle}>
                    {location.address.line2}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex items-start space-x-3">
              <span className="mt-1 text-lg" style={accentStyle}>
                {FOOTER_CONFIG.CONTACT.phoneEmoji}
              </span>
              <div>
                <h4 className="font-bold mb-1 font-sans" style={{ color: COLORS.text.inverse }}>
                  {getTranslatedText({ en: "Contact", kh: "ទំនាក់ទំនង" }, language)}
                </h4>
                <p className="text-sm font-sans font-semibold" style={textSecondaryStyle}>
                  {FOOTER_CONFIG.CONTACT.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 mb-12">
          {/* About Column */}
          <div className="sm:col-span-1">
            <h3
              className={`font-bold text-sm uppercase tracking-wider mb-4 md:mb-6 ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={{ color: COLORS.primary[400] }}
            >
              {getTranslatedText(FOOTER_CONFIG.LINKS.ABOUT.title, language)}
            </h3>
            <div className="space-y-2 md:space-y-3">
              {FOOTER_CONFIG.LINKS.ABOUT.items.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`block transition-all text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
                  style={{ color: COLORS.text.inverse }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = hoverAccentStyle.color
                    e.currentTarget.style.transform = "translateX(4px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = COLORS.text.inverse
                    e.currentTarget.style.transform = "translateX(0)"
                  }}
                >
                  {getTranslatedText(item, language)}
                </a>
              ))}
            </div>
          </div>

          {/* Menu Column */}
          <div className="sm:col-span-1">
            <h3
              className={`font-bold text-sm uppercase tracking-wider mb-4 md:mb-6 ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={{ color: COLORS.primary[400] }}
            >
              {getTranslatedText(FOOTER_CONFIG.LINKS.MENU.title, language)}
            </h3>
            <div className="space-y-2 md:space-y-3">
              {FOOTER_CONFIG.LINKS.MENU.items.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`block transition-all text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
                  style={{ color: COLORS.text.inverse }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = hoverAccentStyle.color
                    e.currentTarget.style.transform = "translateX(4px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = COLORS.text.inverse
                    e.currentTarget.style.transform = "translateX(0)"
                  }}
                >
                  {getTranslatedText(item, language)}
                </a>
              ))}
            </div>
          </div>

          {/* Services Column */}
          <div className="sm:col-span-1">
            <h3
              className={`font-bold text-sm uppercase tracking-wider mb-4 md:mb-6 ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={{ color: COLORS.primary[400] }}
            >
              {getTranslatedText(FOOTER_CONFIG.LINKS.SERVICES.title, language)}
            </h3>
            <div className="space-y-2 md:space-y-3">
              {FOOTER_CONFIG.LINKS.SERVICES.items.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`block transition-all text-sm md:text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
                  style={{ color: COLORS.text.inverse }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = hoverAccentStyle.color
                    e.currentTarget.style.transform = "translateX(4px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = COLORS.text.inverse
                    e.currentTarget.style.transform = "translateX(0)"
                  }}
                >
                  {getTranslatedText(item, language)}
                </a>
              ))}
            </div>
          </div>

          {/* Hours Column */}
          <div className="sm:col-span-1">
            <h3
              className={`font-bold text-sm uppercase tracking-wider mb-4 md:mb-6 ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={{ color: COLORS.primary[400] }}
            >
              {getTranslatedText(FOOTER_CONFIG.HOURS.title, language)}
            </h3>
            <div className="space-y-2 md:space-y-3 text-sm">
              {FOOTER_CONFIG.HOURS.periods.map((period, index) => (
                <div key={index}>
                  <p
                    className={`font-semibold ${language === "kh" ? "font-mono" : "font-sans"}`}
                    style={{ color: COLORS.text.inverse }}
                  >
                    {getTranslatedText(period.days, language)}
                  </p>
                  <p className="font-sans" style={textSecondaryStyle}>
                    {period.hours}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <h3
              className={`font-bold text-sm uppercase tracking-wider mb-4 md:mb-6 ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={{ color: COLORS.primary[400] }}
            >
              {getTranslatedText(FOOTER_CONFIG.NEWSLETTER.title, language)}
            </h3>
            <p className={`text-sm mb-4 ${language === "kh" ? "font-mono" : "font-sans"}`} style={textSecondaryStyle}>
              {getTranslatedText(FOOTER_CONFIG.NEWSLETTER.description, language)}
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder={getTranslatedText(FOOTER_CONFIG.NEWSLETTER.placeholder, language)}
                className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none text-white placeholder-gray-400 text-sm transition-all ${language === "kh" ? "font-mono" : "font-sans"}`}
                style={{
                  backgroundColor: COLORS.gray[700],
                  borderColor: COLORS.gray[600],
                  color: COLORS.text.inverse,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COLORS.primary[500]
                  e.target.style.boxShadow = `0 0 0 3px ${COLORS.primary[500]}22`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = COLORS.gray[600]
                  e.target.style.boxShadow = "none"
                }}
              />
              <button
                className={`w-full px-3 py-2 rounded-lg font-bold text-sm transition-all shadow-md ${language === "kh" ? "font-mono" : "font-sans"}`}
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary[500]} 0%, ${COLORS.primary[700]} 100%)`,
                  color: COLORS.text.inverse,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = `0 8px 20px ${COLORS.primary[600]}44`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = `0 4px 12px ${COLORS.primary[600]}33`
                }}
              >
                {getTranslatedText(FOOTER_CONFIG.NEWSLETTER.button, language)}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`font-bold text-lg ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={{ color: COLORS.primary[400] }}
            >
              {language === "en" ? "Find Us" : "ស្វែងរកយើង"}
            </h3>
           
          </div>
          <div
            className="rounded-xl overflow-hidden p-2 h-[300px] md:h-[400px] relative z-10 border-2"
            style={{
              backgroundColor: COLORS.primary[900],
              borderColor: COLORS.primary[700],
            }}
          >
            <Map center={FOOTER_CONFIG.MAP.center} locationName={FOOTER_CONFIG.MAP.locationName} />
          </div>
        </div>

        <div
          className="border-t-2 pt-6 md:pt-8 flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center"
          style={{
            borderColor: COLORS.primary[700],
          }}
        >
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
            {FOOTER_CONFIG.LEGAL.links.map((link, index) => (
              <a
                key={index}
                href="#"
                className={`text-sm transition-all font-semibold ${language === "kh" ? "font-mono" : "font-sans"}`}
                style={textSecondaryStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = hoverAccentStyle.color
                  e.currentTarget.style.transform = "translateY(-2px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = textSecondaryStyle.color
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                {getTranslatedText(link, language)}
              </a>
            ))}
          </div>

          <p
            className={`text-sm text-center order-last md:order-none font-semibold ${language === "kh" ? "font-mono" : "font-sans"}`}
            style={textTertiaryStyle}
          >
            {getTranslatedText(FOOTER_CONFIG.LEGAL.copyright, language)}
          </p>

          <div className="flex space-x-5 justify-center md:justify-end">
            {FOOTER_CONFIG.SOCIAL_MEDIA.platforms.map((platform, index) => (
              <div
                key={index}
                className="p-2 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: "transparent",
                  border: `2px solid ${COLORS.primary[600]}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.primary[600]
                  e.currentTarget.style.transform = "scale(1.1) translateY(-2px)"
                  e.currentTarget.style.boxShadow = `0 8px 20px ${COLORS.primary[600]}44`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.transform = "scale(1) translateY(0)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <SocialIcon iconName={platform.icon} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
