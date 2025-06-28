import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const result = await query('SELECT * FROM projects WHERE project_no = $1', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { 
      name, aka, fka, type, genre, casting_status, union,
      start_date, end_date, description, musical, publish, archived,
      city1, state1, country1, city2, state2, country2
    } = body;

    const result = await query(
      `UPDATE projects 
       SET name = $1, aka = $2, fka = $3, type = $4, genre = $5, casting_status = $6, "union" = $7,
           start_date = $8, end_date = $9, description = $10, musical = $11, publish = $12, archived = $13,
           city1 = $14, state1 = $15, country1 = $16, city2 = $17, state2 = $18, country2 = $19
       WHERE project_no = $20 
       RETURNING *`,
      [
        name, aka, fka, type, genre, casting_status, union,
        start_date, end_date, description, musical, publish, archived,
        city1, state1, country1, city2, state2, country2, id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const result = await query('DELETE FROM projects WHERE project_no = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
