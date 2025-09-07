import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  center: [number, number];
  locationName?: string;
}

export function Map({ center, locationName = "Daro's Coffee" }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const buttonClickHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);

  // Function to handle opening navigation apps
  const openNavigationApp = (lat: number, lng: number, name: string) => {
    // Check if we're on iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // Open in Apple Maps
      window.open(`http://maps.apple.com/?q=${lat},${lng}&ll=${lat},${lng}&z=16`);
    } else {
      // Open in Google Maps
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && mapContainerRef.current && !mapRef.current) {
      // Initialize the map only once
      mapRef.current = L.map(mapContainerRef.current).setView(center, 16);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      const customIcon = L.icon({
        iconUrl: '/coffee-marker.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      // Create marker with popup
      const marker = L.marker(center, { icon: customIcon })
        .addTo(mapRef.current)
        .bindPopup(`
          <div style="text-align: center;">
            <strong>${locationName}</strong>
            <div style="margin-top: 8px;">
              <button id="navigate-btn" style="
                background: oklch(66.6% 0.179 58.318); 
                color: white; 
                border: none; 
                padding: 8px 12px; 
                border-radius: 4px; 
                cursor: pointer;
                font-size: 14px;
              ">Get Directions</button>
            </div>
          </div>
        `);

      // Open popup by default
      marker.openPopup();

      // Use event delegation for the button click
      buttonClickHandlerRef.current = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.id === 'navigate-btn' || target.closest('#navigate-btn')) {
          e.stopPropagation();
          openNavigationApp(center[0], center[1], locationName);
        }
      };

      // Add event listener to the map container
      if (mapContainerRef.current) {
        mapContainerRef.current.addEventListener('click', buttonClickHandlerRef.current);
      }
      
      // Fix map rendering after container is properly sized
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }

    // Cleanup function
    return () => {
      if (buttonClickHandlerRef.current && mapContainerRef.current) {
        mapContainerRef.current.removeEventListener('click', buttonClickHandlerRef.current);
      }
      
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, locationName]);

  return (
    <div 
      ref={mapContainerRef} 
      className="h-full w-full rounded-xl overflow-hidden" 
      style={{ cursor: 'pointer' }} 
    />
  );
}