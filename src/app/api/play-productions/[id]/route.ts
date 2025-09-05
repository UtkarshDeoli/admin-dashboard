import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid production ID' }, { status: 400 });
    }

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
       WHERE p.production_no = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Play production not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching play production:', error);
    return NextResponse.json({ error: 'Failed to fetch play production' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { 
      play_no, 
      company_no, 
      start_date, 
      end_date, 
      season, 
      festival, 
      canceled, 
      archived 
    } = body;

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid production ID' }, { status: 400 });
    }

    if (!play_no || !company_no) {
      return NextResponse.json({ 
        error: 'Play number and company number are required' 
      }, { status: 400 });
    }

    const result = await query(
      `UPDATE system.play_productions 
       SET play_no = $1, company_no = $2, start_date = $3, end_date = $4, 
           season = $5, festival = $6, canceled = $7, archived = $8
       WHERE production_no = $9 
       RETURNING *`,
      [play_no, company_no, start_date, end_date, season, festival, canceled, archived, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Play production not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating play production:', error);
    return NextResponse.json({ error: 'Failed to update play production' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid production ID' }, { status: 400 });
    }

    const result = await query(
      'UPDATE system.play_productions SET archived = true WHERE production_no = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Play production not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Play production archived successfully' });
  } catch (error) {
    console.error('Error deleting play production:', error);
    return NextResponse.json({ error: 'Failed to delete play production' }, { status: 500 });
  }
}
