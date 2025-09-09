// Copyright (c) 2024 Napulita
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = parseInt(params.id)
    
    if (isNaN(reportId)) {
      return NextResponse.json({ error: 'Invalid report ID' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:author_id (
          handle,
          display_name,
          avatar_url
        )
      `)
      .eq('report_id', reportId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ comments: data })
  } catch (error) {
    console.error('Error in GET /api/reports/[id]/comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = parseInt(params.id)
    const body = await request.json()
    const { body: commentBody, parentId } = body
    
    if (isNaN(reportId)) {
      return NextResponse.json({ error: 'Invalid report ID' }, { status: 400 })
    }

    if (!commentBody || commentBody.trim().length === 0) {
      return NextResponse.json({ error: 'Comment body is required' }, { status: 400 })
    }

    const { data, error } = await supabase.rpc('rpc_post_comment', {
      p_report_id: reportId,
      p_body: commentBody.trim(),
      p_parent_id: parentId || null,
    })

    if (error) {
      console.error('Error posting comment:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ commentId: data })
  } catch (error) {
    console.error('Error in POST /api/reports/[id]/comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
