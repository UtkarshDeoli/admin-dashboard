import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid contributor ID' }, { status: 400 });
    }

    const result = await query(
      'SELECT * FROM play_contributors WHERE pc_no = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Play contributor not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching play contributor:', error);
    return NextResponse.json({ error: 'Failed to fetch play contributor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { play_no, people_no, play_contributor_type } = body;

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid contributor ID' }, { status: 400 });
    }

    if (!play_no || !people_no || !play_contributor_type) {
      return NextResponse.json({ 
        error: 'Play number, people number, and contributor type are required' 
      }, { status: 400 });
    }

    const result = await query(
      `UPDATE play_contributors 
       SET play_no = $1, people_no = $2, play_contributor_type = $3
       WHERE pc_no = $4 
       RETURNING *`,
      [play_no, people_no, play_contributor_type, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Play contributor not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating play contributor:', error);
    return NextResponse.json({ error: 'Failed to update play contributor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid contributor ID' }, { status: 400 });
    }

    const result = await query(
      'DELETE FROM play_contributors WHERE pc_no = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Play contributor not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Play contributor deleted successfully' });
  } catch (error) {
    console.error('Error deleting play contributor:', error);
    return NextResponse.json({ error: 'Failed to delete play contributor' }, { status: 500 });
  }
}
