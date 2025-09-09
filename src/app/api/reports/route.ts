// Copyright (c) 2024 Napulita
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const minLon = parseFloat(searchParams.get('minLon') || '-180')
    const minLat = parseFloat(searchParams.get('minLat') || '-90')
    const maxLon = parseFloat(searchParams.get('maxLon') || '180')
    const maxLat = parseFloat(searchParams.get('maxLat') || '90')
    const status = searchParams.get('status') as any
    const days = parseInt(searchParams.get('days') || '21')

    const { data, error } = await supabase.rpc('rpc_get_reports', {
      p_min_lon: minLon,
      p_min_lat: minLat,
      p_max_lon: maxLon,
      p_max_lat: maxLat,
      p_status: status,
      p_days: days,
    })

    if (error) {
      console.error('Error fetching reports:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ reports: data })
  } catch (error) {
    console.error('Error in GET /api/reports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lat, lon, category, note, photoUrl } = body

    if (!lat || !lon || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: lat, lon, category' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.rpc('rpc_create_report', {
      p_lat: lat,
      p_lon: lon,
      p_category: category,
      p_note: note || null,
      p_photo_url: photoUrl || null,
    })

    if (error) {
      console.error('Error creating report:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ reportId: data })
  } catch (error) {
    console.error('Error in POST /api/reports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
