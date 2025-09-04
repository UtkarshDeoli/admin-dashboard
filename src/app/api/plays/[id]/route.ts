import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid play ID' }, { status: 400 });
    }

    const result = await query(
      'SELECT * FROM plays WHERE play_no = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Play not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching play:', error);
    return NextResponse.json({ error: 'Failed to fetch play' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { title, play_type } = body;

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid play ID' }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const result = await query(
      'UPDATE plays SET title = $1, play_type = $2 WHERE play_no = $3 RETURNING *',
      [title, play_type || [], id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Play not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating play:', error);
    return NextResponse.json({ error: 'Failed to update play' }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid play ID' }, { status: 400 });
    }

    const result = await query(
      'DELETE FROM plays WHERE play_no = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Play not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Play deleted successfully' });
  } catch (error) {
    console.error('Error deleting play:', error);
    return NextResponse.json({ error: 'Failed to delete play' }, { status: 500 });
  }
}