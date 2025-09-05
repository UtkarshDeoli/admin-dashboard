import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const result = await query(
      `SELECT 
         p.production_no,
         p.play_no,
         p.company_no,
         c.name AS company_name,
         to_char(p.start_date, 'YYYY-MM-DD') AS start_date,
         to_char(p.end_date,   'YYYY-MM-DD') AS end_date,
         p.season,
         p.festival,
         p.canceled,
         p.archived
       FROM system.play_productions p
       LEFT JOIN system.companies c ON c.company_no = p.company_no
       ORDER BY p.start_date DESC`
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
      `INSERT INTO system.play_productions 
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
