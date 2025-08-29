"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const bannerImages = [
  {
    id: 1,
    image: "/coffee-shop-discount-banner-with-latte-art.png",
    title: "20% Off All Lattes",
    subtitle: "Limited time offer on our signature lattes",
  },
  {
    id: 2,
    image: "/breakfast-special-banner-with-pastries.png",
    title: "Breakfast Special",
    subtitle: "Buy any coffee + pastry for $8.99",
  },
  {
    id: 3,
    image: "/happy-hour-coffee-banner.png",
    title: "Happy Hour 3-5 PM",
    subtitle: "All espresso drinks 15% off",
  },
  {
    id: 4,
    image: "/loyalty-program-coffee-banner.png",
    title: "Join Our Loyalty Program",
    subtitle: "Earn points with every purchase",
  },
]

export function DiscountBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)
  }

  return (
    <section className="relative h-[33vh] min-h-[250px] overflow-hidden bg-gray-100">
      <div className="relative h-full">
        {bannerImages.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative h-full">
              <img src={banner.image || "/placeholder.svg"} alt={banner.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-2xl px-4">
                  <h2 className="font-serif text-2xl md:text-4xl font-bold mb-4">{banner.title}</h2>
                  <p className="text-lg md:text-xl">{banner.subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 hover:text-gray-900"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 hover:text-gray-900"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 border-2 border-white transition-colors ${
              index === currentSlide ? "bg-white" : "bg-transparent"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
