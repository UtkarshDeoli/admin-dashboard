import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const result = await query(
      `SELECT 
         production_no,
         play_no,
         company_no,
         to_char(start_date, 'YYYY-MM-DD') AS start_date,
         to_char(end_date,   'YYYY-MM-DD') AS end_date,
         season,
         festival,
         canceled,
         archived
       FROM play_productions 
       WHERE archived = false 
       ORDER BY start_date DESC`
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching play productions:', error);
    return NextResponse.json({ error: 'Failed to fetch play productions' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      play_no, 
      company_no, 
      start_date, 
      end_date, 
      season, 
      festival, 
      canceled = false, 
      archived = false 
    } = body;

    if (!play_no || !company_no) {
      return NextResponse.json({ 
        error: 'Play number and company number are required' 
      }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO play_productions 
       (play_no, company_no, start_date, end_date, season, festival, canceled, archived) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [play_no, company_no, start_date, end_date, season, festival, canceled, archived]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating play production:', error);
    return NextResponse.json({ error: 'Failed to create play production' }, { status: 500 });
  }
}
