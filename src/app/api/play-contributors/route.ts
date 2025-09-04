import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const result = await query(
      'SELECT * FROM play_contributors ORDER BY pc_no ASC'
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching play contributors:', error);
    return NextResponse.json({ error: 'Failed to fetch play contributors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { play_no, people_no, play_contributor_type } = body;

    if (!play_no || !people_no || !play_contributor_type) {
      return NextResponse.json({ 
        error: 'Play number, people number, and contributor type are required' 
      }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO play_contributors 
       (play_no, people_no, play_contributor_type) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [play_no, people_no, play_contributor_type]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating play contributor:', error);
    return NextResponse.json({ error: 'Failed to create play contributor' }, { status: 500 });
  }
}
