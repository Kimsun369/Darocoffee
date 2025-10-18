"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchEventsFromGoogleSheet } from "@/data/google-sheet.data"
import { COLORS } from "@/config/color-config"

interface Event {
  id: number | string
  name: string
  abbreviation: string
  name_kh: string
  poster: string
}

interface DiscountBannerProps {
  onEventClick: (eventName: string) => void
  selectedEvent?: string
  language?: "en" | "kh"
}

export function DiscountBanner({ onEventClick, selectedEvent, language = "en" }: DiscountBannerProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<"next" | "prev">("next")

  const fontClass = language === "kh" ? "font-mono" : "font-sans"

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const eventsData = await fetchEventsFromGoogleSheet()
        setEvents(eventsData)

        if (eventsData.length === 0) {
          console.log("No events returned from fetchEventsFromGoogleSheet")
        }
      } catch (err) {
        console.error("Error loading events:", err)
        setError("Failed to load events: " + (err instanceof Error ? err.message : "Unknown error"))
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [])

  const handleTransition = useCallback(
    (newSlide: number, dir: "next" | "prev") => {
      if (isTransitioning) return

      setIsTransitioning(true)
      setDirection(dir)
      setCurrentSlide(newSlide)

      setTimeout(() => {
        setIsTransitioning(false)
      }, 600)
    },
    [isTransitioning],
  )

  const handleNextSlide = useCallback(() => {
    if (isTransitioning || events.length <= 1) return
    const next = (currentSlide + 1) % events.length
    handleTransition(next, "next")
  }, [currentSlide, events.length, isTransitioning, handleTransition])

  const handlePrevSlide = useCallback(() => {
    if (isTransitioning || events.length <= 1) return
    const prev = (currentSlide - 1 + events.length) % events.length
    handleTransition(prev, "prev")
  }, [currentSlide, events.length, isTransitioning, handleTransition])

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide || events.length <= 1) return
    const dir = index > currentSlide ? "next" : "prev"
    handleTransition(index, dir)
  }

  useEffect(() => {
    if (events.length <= 1) return

    const timer = setInterval(() => {
      handleNextSlide()
    }, 2500)

    return () => clearInterval(timer)
  }, [events.length, handleNextSlide])

  const handleBannerClick = (eventName: string) => {
    onEventClick(eventName)
  }

  const eventsWithDisplayData = useMemo(() => {
    return events.map((event) => {
      const displayName = language === "kh" && event.name_kh ? event.name_kh : event.name

      return {
        ...event,
        displayName,
      }
    })
  }, [events, language])

  const currentEventDisplay = eventsWithDisplayData[currentSlide]

  const getTransitionClasses = (index: number) => {
    const baseClasses = "absolute inset-0 transition-all duration-600 ease-in-out cursor-pointer"

    if (index === currentSlide) {
      return `${baseClasses} transform translate-x-0 opacity-100`
    } else {
      if (index === (currentSlide - 1 + events.length) % events.length && direction === "next") {
        return `${baseClasses} transform -translate-x-full opacity-0 pointer-events-none`
      } else if (index === (currentSlide + 1) % events.length && direction === "prev") {
        return `${baseClasses} transform translate-x-full opacity-0 pointer-events-none`
      } else {
        return `${baseClasses} transform ${
          index < currentSlide ? "-translate-x-full" : "translate-x-full"
        } opacity-0 pointer-events-none`
      }
    }
  }

  if (isLoading) {
    return (
      <section 
        className="relative h-[20vh] min-h-[250px] overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: COLORS.gray[100] }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: COLORS.primary[600] }}
          ></div>
          <p 
            className={language === "kh" ? "font-mono" : "font-sans"}
            style={{ color: COLORS.text.secondary }}
          >
            {language === "en" ? "Loading events from Google Sheets..." : "កំពុងផ្ទុកព្រឹត្តិការណ៍ពី Google Sheets..."}
          </p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section 
        className="relative h-[20vh] min-h-[250px] overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: COLORS.gray[100] }}
      >
        <div 
          className={`text-center ${language === "kh" ? "font-mono" : "font-sans"}`}
          style={{ color: COLORS.text.secondary }}
        >
          <p>{language === "en" ? "Unable to load events" : "មិនអាចផ្ទុកព្រឹត្តិការណ៍បានទេ"}</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </section>
    )
  }

  if (events.length === 0) {
    return (
      <section 
        className="relative h-[20vh] min-h-[250px] overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: COLORS.gray[100] }}
      >
        <div 
          className={`text-center ${language === "kh" ? "font-mono" : "font-sans"}`}
          style={{ color: COLORS.text.secondary }}
        >
          <p>{language === "en" ? "No events available" : "មិនមានព្រឹត្តិការណ៍ដែលអាចប្រើបានទេ"}</p>
          <p className="text-sm mt-2">
            {language === "en"
              ? "Add events to your Google Sheets to see them here"
              : "បន្ថែមព្រឹត្តិការណ៍ទៅក្នុង Google Sheets របស់អ្នកដើម្បីមើលពួកវានៅទីនេះ"}
          </p>
        </div>
      </section>
    )
  }

  if (!currentEventDisplay) {
    return null
  }

  return (
    <section 
      className="relative h-[20vh] min-h-[250px] overflow-hidden"
      style={{ backgroundColor: COLORS.gray[100] }}
    >
      <div className="relative h-full overflow-hidden">
        {eventsWithDisplayData.map((event, index) => (
          <div key={event.id} className={getTransitionClasses(index)} onClick={() => handleBannerClick(event.name)}>
            <div className="relative h-full">
              <img
                src={event.poster || "/placeholder.svg"}
                alt={event.displayName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
              <div
                className="absolute inset-0 transition-all duration-300"
                style={{
                  backgroundColor: selectedEvent === event.name 
                    ? `${COLORS.primary[600]}30` 
                    : 'rgba(0, 0, 0, 0.4)'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`text-center text-white max-w-2xl px-4 ${language === "kh" ? "font-mono" : "font-sans"}`}
                >
                  <h2
                    className={`text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg ${language === "kh" ? "font-mono" : "font-sans"}`}
                  >
                    {event.displayName}
                    {selectedEvent === event.name && (
                      <span 
                        className={`ml-3 text-sm px-3 py-1 rounded-full ${fontClass}`}
                        style={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: COLORS.text.inverse
                        }}
                      >
                        {language === "en" ? "Active" : "សកម្ម"}
                      </span>
                    )}
                  </h2>
                  <p className={`text-sm opacity-90 ${language === "kh" ? "font-mono" : "font-sans"}`}>
                    {language === "en" ? "Click to view discounts" : "ចុចដើម្បីមើលការបញ្ចុះតម្លៃ"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevSlide}
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 -translate-y-1/2 hover:bg-white text-gray-800 rounded-full h-10 w-10 shadow-lg transition-all disabled:opacity-50"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: COLORS.text.primary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.background.primary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
            }}
            aria-label={language === "en" ? "Previous event" : "ព្រឹត្តិការណ៍មុន"}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextSlide}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white text-gray-800 rounded-full h-10 w-10 shadow-lg transition-all disabled:opacity-50"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: COLORS.text.primary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.background.primary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
            }}
            aria-label={language === "en" ? "Next event" : "ព្រឹត្តិការណ៍បន្ទាប់"}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {events.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`h-2 rounded-full transition-all duration-300 disabled:opacity-50 ${
                index === currentSlide ? "w-8" : "w-2 hover:bg-white/80"
              }`}
              style={{
                backgroundColor: index === currentSlide 
                  ? COLORS.text.inverse 
                  : 'rgba(255, 255, 255, 0.6)'
              }}
              aria-label={language === "en" ? `Go to event ${index + 1}` : `ទៅកាន់ព្រឹត្តិការណ៍ ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}