import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  center: [number, number];
  locationName?: string;
}

export function Map({ center, locationName = "Daro's Coffee" }: MapProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const map = L.map('map').setView(center, 16);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const customIcon = L.icon({
        iconUrl: '/coffee-marker.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      // Create marker with popup
      const marker = L.marker(center, { icon: customIcon })
        .addTo(map)
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

      // Handle map click to open navigation
      const handleMapClick = () => {
        openNavigationApp(center[0], center[1], locationName);
      };

      map.on('click', handleMapClick);
      
      // Cleanup function
      return () => {
        map.off('click', handleMapClick);
        map.remove();
      };
    }
  }, [center, locationName]);

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

  return <div id="map" className="h-full w-full rounded-xl overflow-hidden" style={{ cursor: 'pointer' }} />;
}