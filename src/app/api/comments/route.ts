import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entity_type');
    const entityNo = searchParams.get('entity_no');
    
    if (!entityType || !entityNo) {
      return NextResponse.json(
        { error: 'entity_type and entity_no are required' },
        { status: 400 }
      );
    }

    const result = await query(
      'SELECT * FROM comments WHERE entity_type = $1 AND entity_no = $2 ORDER BY date DESC',
      [entityType, entityNo]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entity_type, entity_no, admin_no, comment } = body;

    if (!entity_type || !entity_no || !admin_no || !comment) {
      return NextResponse.json(
        { error: 'entity_type, entity_no, admin_no, and comment are required' },
        { status: 400 }
      );
    }

    // Get the next ID manually since we don't have sequence permissions
    const maxResult = await query('SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM comments');
    const nextId = maxResult.rows[0].next_id;

    const result = await query(
      `INSERT INTO comments (id, entity_type, entity_no, admin_no, date, comment) 
       VALUES ($1, $2, $3, $4, NOW(), $5) 
       RETURNING *`,
      [nextId, entity_type, entity_no, admin_no, comment]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
