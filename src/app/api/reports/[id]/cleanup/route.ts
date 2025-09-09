// Copyright (c) 2024 Napulita
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = parseInt(params.id)
    const body = await request.json()
    const { afterPhotoUrl, afterLat, afterLon } = body
    
    if (isNaN(reportId)) {
      return NextResponse.json({ error: 'Invalid report ID' }, { status: 400 })
    }

    if (!afterPhotoUrl || !afterLat || !afterLon) {
      return NextResponse.json(
        { error: 'Missing required fields: afterPhotoUrl, afterLat, afterLon' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.rpc('rpc_submit_cleanup', {
      p_report_id: reportId,
      p_after_photo_url: afterPhotoUrl,
      p_after_lat: afterLat,
      p_after_lon: afterLon,
    })

    if (error) {
      console.error('Error submitting cleanup:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: data })
  } catch (error) {
    console.error('Error in POST /api/reports/[id]/cleanup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
