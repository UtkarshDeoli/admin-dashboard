import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

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
      return NextResponse.json({ error: 'Contributor not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Contributor deleted successfully' });
  } catch (error) {
    console.error('Error deleting contributor:', error);
    return NextResponse.json({ error: 'Failed to delete contributor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { people_no, play_contributor_type } = body;

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid contributor ID' }, { status: 400 });
    }

    if (!people_no || !play_contributor_type) {
      return NextResponse.json({ 
        error: 'People number and contributor type are required' 
      }, { status: 400 });
    }

    const result = await query(
      'UPDATE play_contributors SET people_no = $1, play_contributor_type = $2 WHERE pc_no = $3 RETURNING *',
      [people_no, play_contributor_type, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Contributor not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating contributor:', error);
    return NextResponse.json({ error: 'Failed to update contributor' }, { status: 500 });
  }
}