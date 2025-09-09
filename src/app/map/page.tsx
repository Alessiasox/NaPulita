'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  )
})

export default function MapPage() {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">🗺️ Map</h1>
          <a href="/" className="text-green-600 font-medium text-sm hover:text-green-700">← Home</a>
        </div>
      </header>
      
      <div className="flex-1 relative">
        <MapComponent />
      </div>
    </div>
  )
}
