// DiscountBanner.tsx
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
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

type TransitionStyle = "slide" | "fade" | "zoom" | "flip" | "cube";

export function DiscountBanner({ onEventClick, selectedEvent, language = "en" }: DiscountBannerProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<"next" | "prev">("next")
  const [transitionStyle, setTransitionStyle] = useState<TransitionStyle>("slide")
  
  const fontClass = language === "kh" ? "font-mono" : "font-sans"

  // Fetch events from Google Sheets
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log("Starting to fetch events...")
        const eventsData = await fetchEventsFromGoogleSheet()
        console.log("Fetched events data:", eventsData)
        
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

  const handleTransition = useCallback((newSlide: number, dir: "next" | "prev") => {
    if (isTransitioning) return;
    
    setIsTransitioning(true)
    setDirection(dir)
    setCurrentSlide(newSlide)
    
    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 600)
  }, [isTransitioning])

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

  // Auto-slide effect - FIXED: Now 2500ms (2.5 seconds)
  useEffect(() => {
    if (events.length <= 1) return

    const timer = setInterval(() => {
      handleNextSlide()
    }, 2500) // Changed from 5000 to 2500 for 2.5 seconds

    return () => clearInterval(timer)
  }, [events.length, handleNextSlide]) // Added handleNextSlide to dependencies

  const handleBannerClick = (eventName: string) => {
    onEventClick(eventName)
  }

  // Use useMemo to memoize ALL events display data based on language
  const eventsWithDisplayData = useMemo(() => {
    return events.map(event => {
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
  }, [language, currentEventDisplay, events.length]);

  // Get transition classes based on selected style
  const getTransitionClasses = (index: number) => {
    const baseClasses = "absolute inset-0 transition-all duration-600 ease-in-out cursor-pointer"
    
    if (index === currentSlide) {
      // Active slide
      switch (transitionStyle) {
        case "slide":
          return `${baseClasses} transform ${
            direction === "next" 
              ? "translate-x-0 opacity-100" 
              : "translate-x-0 opacity-100"
          }`
        case "fade":
          return `${baseClasses} opacity-100`
        case "zoom":
          return `${baseClasses} transform scale-100 opacity-100`
        case "flip":
          return `${baseClasses} transform rotate-0 opacity-100`
        case "cube":
          return `${baseClasses} transform translate-x-0 opacity-100`
        default:
          return `${baseClasses} opacity-100`
      }
    } else {
      // Inactive slides
      switch (transitionStyle) {
        case "slide":
          if (index === (currentSlide - 1 + events.length) % events.length && direction === "next") {
            return `${baseClasses} transform -translate-x-full opacity-0 pointer-events-none`
          } else if (index === (currentSlide + 1) % events.length && direction === "prev") {
            return `${baseClasses} transform translate-x-full opacity-0 pointer-events-none`
          } else {
            return `${baseClasses} transform ${
              index < currentSlide ? "-translate-x-full" : "translate-x-full"
            } opacity-0 pointer-events-none`
          }
        
        case "fade":
          return `${baseClasses} opacity-0 pointer-events-none`
        
        case "zoom":
          if (index === (currentSlide - 1 + events.length) % events.length && direction === "next") {
            return `${baseClasses} transform scale-110 opacity-0 pointer-events-none`
          } else {
            return `${baseClasses} transform scale-90 opacity-0 pointer-events-none`
          }
        
        case "flip":
          if (index === (currentSlide - 1 + events.length) % events.length && direction === "next") {
            return `${baseClasses} transform rotate-y-90 opacity-0 pointer-events-none`
          } else {
            return `${baseClasses} transform -rotate-y-90 opacity-0 pointer-events-none`
          }
        
        case "cube":
          if (index === (currentSlide - 1 + events.length) % events.length && direction === "next") {
            return `${baseClasses} transform -translate-x-full rotate-y-90 opacity-0 pointer-events-none`
          } else if (index === (currentSlide + 1) % events.length && direction === "prev") {
            return `${baseClasses} transform translate-x-full -rotate-y-90 opacity-0 pointer-events-none`
          } else {
            return `${baseClasses} transform ${
              index < currentSlide ? "-translate-x-full" : "translate-x-full"
            } opacity-0 pointer-events-none`
          }
        
        default:
          return `${baseClasses} opacity-0 pointer-events-none`
      }
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <section className="relative h-[33vh] min-h-[250px] overflow-hidden bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className={`text-gray-600 ${language === "kh" ? "font-mono" : "font-sans"}`}>
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
        <div className={`text-center text-gray-600 ${language === "kh" ? "font-mono" : "font-sans"}`}>
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
        <div className={`text-center text-gray-600 ${language === "kh" ? "font-mono" : "font-sans"}`}>
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
      {/* Transition Style Selector (for testing) */}
      <div className="absolute top-4 left-4 z-20 bg-black/50 rounded-lg p-2 hidden">
        <select 
          value={transitionStyle}
          onChange={(e) => setTransitionStyle(e.target.value as TransitionStyle)}
          className="text-xs bg-white/90 px-2 py-1 rounded"
        >
          <option value="slide">Slide</option>
          <option value="fade">Fade</option>
          <option value="zoom">Zoom</option>
          <option value="flip">3D Flip</option>
          <option value="cube">Cube</option>
        </select>
      </div>

      <div className="relative h-full overflow-hidden">
        {eventsWithDisplayData.map((event, index) => (
          <div
            key={event.id}
            className={getTransitionClasses(index)}
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
                <div className={`text-center text-white max-w-2xl px-4 ${language === "kh" ? "font-mono" : "font-sans"}`}>
                  <h2 className={`text-2xl md:text-4xl font-bold mb-4 drop-shadow-lg ${language === "kh" ? "font-mono" : "font-sans"}`}>
                    {event.displayName}
                    {selectedEvent === event.name && (
                      <span className={`ml-3 text-sm bg-white/20 px-2 py-1 rounded-full ${fontClass}`}>
                        {language === "en" ? "Active" : "សកម្ម"}
                      </span>
                    )}
                  </h2>
                  <p className={`text-sm mt-2 opacity-90 ${language === "kh" ? "font-mono" : "font-sans"}`}>
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
            className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 hover:text-gray-900 transition-all duration-300 hover:scale-110 disabled:opacity-50 ${language === "kh" ? "font-mono" : "font-sans"}`}
            aria-label={language === "en" ? "Previous event" : "ព្រឹត្តិការណ៍មុន"}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextSlide}
            disabled={isTransitioning}
            className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 hover:text-gray-900 transition-all duration-300 hover:scale-110 disabled:opacity-50 ${language === "kh" ? "font-mono" : "font-sans"}`}
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
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`h-3 w-3 rounded-full border-2 border-white transition-all duration-300 hover:scale-125 disabled:opacity-50 ${
                index === currentSlide ? "bg-white scale-125" : "bg-transparent"
              } ${language === "kh" ? "font-mono" : "font-sans"}`}
              aria-label={language === "en" ? `Go to event ${index + 1}` : `ទៅកាន់ព្រឹត្តិការណ៍ ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}