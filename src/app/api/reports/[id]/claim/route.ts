// Copyright (c) 2024 Napulita
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = parseInt(params.id)
    
    if (isNaN(reportId)) {
      return NextResponse.json({ error: 'Invalid report ID' }, { status: 400 })
    }

    const { data, error } = await supabase.rpc('rpc_claim_report', {
      p_report_id: reportId,
    })

    if (error) {
      console.error('Error claiming report:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: data })
  } catch (error) {
    console.error('Error in POST /api/reports/[id]/claim:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
