// Copyright (c) 2024 Napulita
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const weekly = searchParams.get('weekly') === 'true'

    const { data, error } = await supabase.rpc('rpc_get_leaderboard', {
      p_weekly: weekly,
    })

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ leaderboard: data })
  } catch (error) {
    console.error('Error in GET /api/leaderboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
