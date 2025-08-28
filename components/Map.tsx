import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  center: [number, number];
}

export function Map({ center }: MapProps) {
  useEffect(() => {
    // Make sure the map instance is only created once
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

      L.marker(center, { icon: customIcon })
        .addTo(map)
        .bindPopup("Daro's Coffee");

      return () => map.remove();
    }
  }, [center]);

  return <div id="map" className="h-full w-full rounded-xl overflow-hidden" />;
}
