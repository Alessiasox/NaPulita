'use client'

import { useState } from 'react'

export default function ReportPage() {
  const [reportType, setReportType] = useState<'trash' | 'dog_poop'>('trash')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false)
      alert('Report submitted successfully!')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">📝 New Report</h1>
          <a href="/" className="text-green-600 font-medium text-sm hover:text-green-700">← Home</a>
        </div>
      </header>

      <div className="max-w-md mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="trash"
                  checked={reportType === 'trash'}
                  onChange={(e) => setReportType(e.target.value as 'trash' | 'dog_poop')}
                  className="mr-2"
                />
                <span>��️ Trash</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="dog_poop"
                  checked={reportType === 'dog_poop'}
                  onChange={(e) => setReportType(e.target.value as 'trash' | 'dog_poop')}
                  className="mr-2"
                />
                <span>🐕 Dog Poop</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe the issue..."
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">📸 Photo Required</h3>
            <p className="text-sm text-blue-700">
              Take a photo of the issue. GPS location will be automatically captured.
            </p>
            <button
              type="button"
              className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              📷 Take Photo
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  )
}
