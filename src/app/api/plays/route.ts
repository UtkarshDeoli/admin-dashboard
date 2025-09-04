import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const result = await query(
      'SELECT * FROM plays ORDER BY title ASC'
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching plays:', error);
    return NextResponse.json({ error: 'Failed to fetch plays' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, play_type } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO plays (title, play_type) VALUES ($1, $2) RETURNING *',
      [title, play_type || []]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating play:', error);
    return NextResponse.json({ error: 'Failed to create play' }, { status: 500 });
  }
}
