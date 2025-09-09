// Copyright (c) 2024 Napulita
'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { ReportMarker } from './ReportMarker'

interface Report {
  id: number
  lat: number
  lon: number
  category: string
  status: string
  before_photo_url?: string
  created_at: string
}

export function Map() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      },
      center: [14.2681, 40.8518], // Naples coordinates
      zoom: 13,
      maxZoom: 18,
      minZoom: 10
    })

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    // Load reports when map is ready
    map.current.on('load', () => {
      loadReports()
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  const loadReports = async () => {
    try {
      if (!map.current) return

      const bounds = map.current.getBounds()
      const response = await fetch(
        `/api/reports?minLon=${bounds.getWest()}&minLat=${bounds.getSouth()}&maxLon=${bounds.getEast()}&maxLat=${bounds.getNorth()}&days=21`
      )
      const data = await response.json()
      
      if (data.reports) {
        setReports(data.reports)
        addMarkersToMap(data.reports)
      }
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const addMarkersToMap = (reports: Report[]) => {
    if (!map.current) return

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.report-marker')
    existingMarkers.forEach(marker => marker.remove())

    // Add new markers
    reports.forEach(report => {
      const marker = new maplibregl.Marker({
        element: ReportMarker({ report }),
        anchor: 'bottom'
      })
        .setLngLat([report.lon, report.lat])
        .addTo(map.current!)
    })
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full" />
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}
    </div>
  )
}
