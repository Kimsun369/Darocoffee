import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { COLORS } from '@/config/color-config'; // Adjust import path as needed

interface MapProps {
  center: [number, number];
  locationName?: string;
  language?: 'en' | 'kh';
}

export function Map({ 
  center, 
  locationName = "Daro's Coffee",
  language = 'en'
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const popupRef = useRef<L.Popup | null>(null);

  // Function to handle opening navigation apps
  const openNavigationApp = (lat: number, lng: number, name: string) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      window.open(`http://maps.apple.com/?q=${lat},${lng}&ll=${lat},${lng}&z=16`);
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`);
    }
  };

  // Function to create popup content with current colors
  const createPopupContent = () => {
    return `
      <div style="text-align: center;">
        <strong style="color: ${COLORS.text.primary}; font-family: ${language === 'kh' ? 'monospace' : 'sans-serif'};">${locationName}</strong>
        <div style="margin-top: 8px;">
          <button id="navigate-btn" style="
            background: linear-gradient(135deg, ${COLORS.primary[500]} 0%, ${COLORS.primary[700]} 100%);
            color: ${COLORS.text.inverse}; 
            border: none; 
            padding: 8px 16px; 
            border-radius: 8px; 
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            font-family: ${language === 'kh' ? 'monospace' : 'sans-serif'};
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px ${COLORS.primary[600]}33;
          ">${language === 'en' ? 'Get Directions' : 'ទទួលបានទិសដៅ'}</button>
        </div>
      </div>
    `;
  };

  // Function to update popup content when colors change
  const updatePopupContent = () => {
    if (markerRef.current && popupRef.current) {
      popupRef.current.setContent(createPopupContent());
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
      markerRef.current = L.marker(center, { icon: customIcon }).addTo(mapRef.current);
      popupRef.current = L.popup().setContent(createPopupContent());
      
      markerRef.current.bindPopup(popupRef.current);
      markerRef.current.openPopup();

      // Fix map rendering after container is properly sized
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }

    // Update popup content when colors or language change
    updatePopupContent();
  }, [center, locationName, language]);

  // Effect for handling button clicks with event delegation
  useEffect(() => {
    const handleMapClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const navigateBtn = target.id === 'navigate-btn' ? target : target.closest('#navigate-btn');
      
      if (navigateBtn) {
        e.stopPropagation();
        openNavigationApp(center[0], center[1], locationName);
      }
    };

    const handleButtonHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const navigateBtn = target.id === 'navigate-btn' ? target : target.closest('#navigate-btn');
      
      if (navigateBtn) {
        if (e.type === 'mouseenter') {
          (navigateBtn as HTMLElement).style.transform = "translateY(-2px)";
          (navigateBtn as HTMLElement).style.boxShadow = `0 8px 20px ${COLORS.primary[600]}44`;
        } else if (e.type === 'mouseleave') {
          (navigateBtn as HTMLElement).style.transform = "translateY(0)";
          (navigateBtn as HTMLElement).style.boxShadow = `0 4px 12px ${COLORS.primary[600]}33`;
        }
      }
    };

    if (mapContainerRef.current) {
      mapContainerRef.current.addEventListener('click', handleMapClick);
      mapContainerRef.current.addEventListener('mouseenter', handleButtonHover, true);
      mapContainerRef.current.addEventListener('mouseleave', handleButtonHover, true);
    }

    return () => {
      if (mapContainerRef.current) {
        mapContainerRef.current.removeEventListener('click', handleMapClick);
        mapContainerRef.current.removeEventListener('mouseenter', handleButtonHover, true);
        mapContainerRef.current.removeEventListener('mouseleave', handleButtonHover, true);
      }
    };
  }, [center, locationName]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainerRef} 
      className="h-full w-full rounded-xl overflow-hidden" 
      style={{ cursor: 'pointer' }} 
    />
  );
}