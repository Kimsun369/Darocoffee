"use client"

import { MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react"

interface ContactSectionProps {
  language: "en" | "kh"
}

export function ContactSection({ language }: ContactSectionProps) {
  return (
    <section
      className="py-16 px-4"
      style={{
        backgroundColor: "#fef3c7",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d97706' fillOpacity='0.05' fillRule='evenodd'/%3E%3C/svg%3E")`,
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div
          className="text-center mb-12"
          style={{
            animation: "fadeInUp 0.6s ease-out",
          }}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{ color: "#d97706" }}>
            {language === "en" ? "Visit Us" : "មកលេងយើង"}
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#78716c" }}>
            {language === "en"
              ? "Experience the perfect blend of comfort and quality at our coffee shop"
              : "ជួបជាមួយការលាយបញ្ចូលដ៏ល្អឥតខ្ចោះនៃភាពស្រួលស្រាល និងគុណភាពនៅហាងកាហ្វេរបស់យើង"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: MapPin,
              title: language === "en" ? "Location" : "ទីតាំង",
              content: "123 Coffee Street\nPhnom Penh, Cambodia",
              delay: 0,
            },
            {
              icon: Phone,
              title: language === "en" ? "Phone" : "លេខទូរស័ព្ទ",
              content: "+855 12 345 678\n+855 98 765 432",
              delay: 0.1,
            },
            {
              icon: Clock,
              title: language === "en" ? "Hours" : "ម៉ោងបើក",
              content: `${language === "en" ? "Mon - Sun" : "ច័ន្ទ - អាទិត្យ"}\n6:00 AM - 10:00 PM`,
              delay: 0.2,
            },
            { icon: Instagram, title: language === "en" ? "Follow Us" : "តាមដានយើង", content: null, delay: 0.3 },
          ].map((item, index) => (
            <div
              key={index}
              className="text-center rounded-xl overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: "white",
                border: "2px solid #fbbf24",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                animation: `fadeInUp 0.6s ease-out ${item.delay}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)"
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(217, 119, 6, 0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)"
              }}
            >
              <div className="p-6">
                <div
                  className="w-16 h-16 flex items-center justify-center mx-auto mb-4 rounded-full transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                    animation: "pulse-icon 2s ease-in-out infinite",
                  }}
                >
                  <item.icon className="h-7 w-7" style={{ color: "white" }} />
                </div>
                <h3 className="font-semibold text-lg mb-3" style={{ color: "#1f2937" }}>
                  {item.title}
                </h3>
                {item.content ? (
                  <p className="text-sm whitespace-pre-line" style={{ color: "#6b7280" }}>
                    {item.content}
                  </p>
                ) : (
                  <div className="flex justify-center space-x-4">
                    <a
                      href="#"
                      className="transition-all duration-300"
                      style={{ color: "#6b7280" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#d97706"
                        e.currentTarget.style.transform = "scale(1.2)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#6b7280"
                        e.currentTarget.style.transform = "scale(1)"
                      }}
                    >
                      <Instagram className="h-6 w-6" />
                    </a>
                    <a
                      href="#"
                      className="transition-all duration-300"
                      style={{ color: "#6b7280" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#d97706"
                        e.currentTarget.style.transform = "scale(1.2)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#6b7280"
                        e.currentTarget.style.transform = "scale(1)"
                      }}
                    >
                      <Facebook className="h-6 w-6" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-icon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </section>
  )
}
