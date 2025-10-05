"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchEventsFromGoogleSheet } from "@/data/google-sheet.data"

interface Event {
  id: number | string
  name: string
  abbreviation: string
  poster: string
}

export function DiscountBanner() {
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

  // Show loading state
  if (isLoading) {
    return (
      <section className="relative h-[33vh] min-h-[250px] overflow-hidden bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events from Google Sheets...</p>
        </div>
      </section>
    )
  }

  // Show error state
  if (error) {
    return (
      <section className="relative h-[33vh] min-h-[250px] overflow-hidden bg-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p>Unable to load events</p>
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
          <p>No events available</p>
          <p className="text-sm mt-2">Add events to your Google Sheets to see them here</p>
          <p className="text-xs mt-1">Check browser console for debugging information</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-[33vh] min-h-[250px] overflow-hidden bg-gray-100">
      <div className="relative h-full">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="relative h-full">
              <img 
                src={event.poster} 
                alt={event.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-2xl px-4">
                  <h2 className="font-serif text-2xl md:text-4xl font-bold mb-4 drop-shadow-lg">
                    {event.name}
                  </h2>
                  <p className="text-lg md:text-xl drop-shadow-md">
                    {event.abbreviation}
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
            aria-label="Previous event"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 hover:text-gray-900 transition-all duration-300 hover:scale-110"
            aria-label="Next event"
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
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}