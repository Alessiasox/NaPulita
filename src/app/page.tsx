// Copyright (c) 2024 Napulita
'use client'

import { useEffect, useState } from 'react'

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Napulita...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Napulita</h1>
            <p className="text-sm text-gray-600">Keep Naples clean</p>
          </div>
          <a
            href="/signin"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Napulita
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Help keep Naples clean by reporting trash and dog poop. 
            Earn points and compete on leaderboards!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Report Issues
            </h3>
            <p className="text-gray-600">
              Take a photo and report trash or dog poop in your neighborhood.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🧹</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Clean Up
            </h3>
            <p className="text-gray-600">
              Claim reports and clean them up to earn points and help your community.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Compete
            </h3>
            <p className="text-gray-600">
              See your ranking on weekly and all-time leaderboards.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="space-y-3">
            <a
              href="/map"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              View Map
            </a>
            <div className="flex justify-center space-x-4">
              <a
                href="/report"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Report Issue
              </a>
              <a
                href="/leaderboard"
                className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
              >
                Leaderboard
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Napulita. Built with ❤️ for Naples.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
