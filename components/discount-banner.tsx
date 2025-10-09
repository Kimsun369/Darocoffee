// DiscountBanner.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchEventsFromGoogleSheet } from "@/data/google-sheet.data"

interface Event {
  id: number | string
  name: string
  abbreviation: string
  name_kh: string // Khmer event name
  poster: string
}

interface DiscountBannerProps {
  onEventClick: (eventName: string) => void
  selectedEvent?: string
  language?: "en" | "kh" // Language prop for bilingual support
}

export function DiscountBanner({ onEventClick, selectedEvent, language = "en" }: DiscountBannerProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch events from Google Sheets
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log("Starting to fetch events...")
        const eventsData = await fetchEventsFromGoogleSheet()
        console.log("Fetched events data:", eventsData)
        
        // Debug: Check if events have name_kh
        eventsData.forEach((event: Event, index: number) => {
          console.log(`Event ${index}:`, {
            name: event.name,
            name_kh: event.name_kh,
            hasKhmer: !!event.name_kh && event.name_kh !== event.name
          })
        })
        
        setEvents(eventsData)
        
        if (eventsData.length === 0) {
          console.log("No events returned from fetchEventsFromGoogleSheet")
        }
      } catch (err) {
        console.error("Error loading events:", err)
        setError("Failed to load events: " + (err instanceof Error ? err.message : 'Unknown error'))
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [])

  // Auto-slide effect
  useEffect(() => {
    if (events.length <= 1) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [events.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % events.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length)
  }

  const handleBannerClick = (eventName: string) => {
    onEventClick(eventName)
  }

  // Use useMemo to memoize ALL events display data based on language
  const eventsWithDisplayData = useMemo(() => {
    return events.map(event => {
      // For Khmer language, only show the Khmer name (no abbreviation)
      const displayName = language === "kh" && event.name_kh ? event.name_kh : event.name;
      
      return {
        ...event,
        displayName,
      };
    });
  }, [events, language]);

  // Get current event display data
  const currentEventDisplay = eventsWithDisplayData[currentSlide];

  // Debug language and events changes
  useEffect(() => {
    console.log(`🔄 Language/events changed - language: ${language}, events count: ${events.length}`);
    if (currentEventDisplay) {
      console.log(`📝 Current display data:`, {
        originalName: currentEventDisplay.name,
        khmerName: currentEventDisplay.name_kh,
        displayName: currentEventDisplay.displayName,
        language
      });
    }
  }, [language, currentEventDisplay]);

  // Show loading state
  if (isLoading) {
    return (
      <section className="relative h-[33vh] min-h-[250px] overflow-hidden bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === "en" ? "Loading events from Google Sheets..." : "កំពុងផ្ទុកព្រឹត្តិការណ៍ពី Google Sheets..."}
          </p>
        </div>
      </section>
    )
  }

  // Show error state
  if (error) {
    return (
      <section className="relative h-[33vh] min-h-[250px] overflow-hidden bg-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p>{language === "en" ? "Unable to load events" : "មិនអាចផ្ទុកព្រឹត្តិការណ៍បានទេ"}</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </section>
    )
  }

  // Show empty state
  if (events.length === 0) {
    return (
      <section className="relative h-[33vh] min-h-[250px] overflow-hidden bg-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-600">
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
    return null;
  }

  return (
    <section className="relative h-[33vh] min-h-[250px] overflow-hidden bg-gray-100">
      <div className="relative h-full">
        {eventsWithDisplayData.map((event, index) => (
          <div
            key={event.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => handleBannerClick(event.name)}
          >
            <div className="relative h-full">
              <img 
                src={event.poster} 
                alt={event.displayName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
              <div className={`absolute inset-0 transition-all duration-300 ${
                selectedEvent === event.name ? "bg-blue-600/40" : "bg-black/50"
              }`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-2xl px-4">
                  {/* FIXED: Single line display for both languages */}
                  <h2 className="font-serif text-2xl md:text-4xl font-bold mb-4 drop-shadow-lg">
                    {event.displayName}
                    {selectedEvent === event.name && (
                      <span className="ml-3 text-sm bg-white/20 px-2 py-1 rounded-full">
                        {language === "en" ? "Active" : "សកម្ម"}
                      </span>
                    )}
                  </h2>
                  {/* REMOVED: The abbreviation line for cleaner display */}
                  <p className="text-sm mt-2 opacity-90">
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
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 hover:text-gray-900 transition-all duration-300 hover:scale-110"
            aria-label={language === "en" ? "Previous event" : "ព្រឹត្តិការណ៍មុន"}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 hover:text-gray-900 transition-all duration-300 hover:scale-110"
            aria-label={language === "en" ? "Next event" : "ព្រឹត្តិការណ៍បន្ទាប់"}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {events.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full border-2 border-white transition-all duration-300 hover:scale-125 ${
                index === currentSlide ? "bg-white" : "bg-transparent"
              }`}
              aria-label={language === "en" ? `Go to event ${index + 1}` : `ទៅកាន់ព្រឹត្តិការណ៍ ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}