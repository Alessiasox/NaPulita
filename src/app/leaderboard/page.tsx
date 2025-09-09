'use client'

import { useState, useEffect } from 'react'

interface LeaderboardEntry {
  id: string
  username: string
  points: number
  reports_cleaned: number
  rank: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all_time'>('weekly')

  useEffect(() => {
    // Simulate loading leaderboard data
    const mockData: LeaderboardEntry[] = [
      { id: '1', username: 'Mario_Rossi', points: 150, reports_cleaned: 15, rank: 1 },
      { id: '2', username: 'Giulia_Verdi', points: 120, reports_cleaned: 12, rank: 2 },
      { id: '3', username: 'Antonio_Bianchi', points: 95, reports_cleaned: 9, rank: 3 },
      { id: '4', username: 'Francesca_Neri', points: 80, reports_cleaned: 8, rank: 4 },
      { id: '5', username: 'Luca_Blu', points: 65, reports_cleaned: 6, rank: 5 },
    ]

    setTimeout(() => {
      setLeaderboard(mockData)
      setLoading(false)
    }, 1000)
  }, [timeframe])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">🏆 Leaderboard</h1>
          <a href="/" className="text-green-600 font-medium text-sm hover:text-green-700">← Home</a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Cleaners</h2>
            
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setTimeframe('weekly')}
                className={`px-3 py-1 rounded text-sm ${
                  timeframe === 'weekly' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setTimeframe('monthly')}
                className={`px-3 py-1 rounded text-sm ${
                  timeframe === 'monthly' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setTimeframe('all_time')}
                className={`px-3 py-1 rounded text-sm ${
                  timeframe === 'all_time' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          <div className="divide-y">
            {leaderboard.map((entry, index) => (
              <div key={entry.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{entry.username}</h3>
                    <p className="text-sm text-gray-600">{entry.reports_cleaned} reports cleaned</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{entry.points}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 border-t">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Want to join the leaderboard?</p>
              <a 
                href="/report" 
                className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
              >
                Start Cleaning!
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
