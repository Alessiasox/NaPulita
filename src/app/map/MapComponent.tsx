'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current).setView([40.8518, 14.2681], 13) // Naples coordinates

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Add a sample marker for Naples
    L.marker([40.8518, 14.2681])
      .addTo(map)
      .bindPopup('Welcome to Naples! 🍕<br>This is where reports will appear.')

    // Add click handler to create new reports
    map.on('click', (e) => {
      const { lat, lng } = e.latlng
      L.popup()
        .setLatLng([lat, lng])
        .setContent(`
          <div class="p-2">
            <h3 class="font-bold mb-2">New Report</h3>
            <p class="text-sm mb-2">Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
            <button 
              onclick="alert('Report feature coming soon!')" 
              class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Report Issue
            </button>
          </div>
        `)
        .openOn(map)
    })

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  )
}
