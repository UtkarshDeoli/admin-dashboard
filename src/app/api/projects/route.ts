import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM projects ORDER BY project_no');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, aka, fka, type, genre, casting_status, union,
      start_date, end_date, description, musical, publish, archived,
      city1, state1, country1, city2, state2, country2
    } = body;

    // Get the next project_no manually since we don't have sequence permissions
    const maxResult = await query('SELECT COALESCE(MAX(project_no), 0) + 1 as next_id FROM projects');
    const nextProjectNo = maxResult.rows[0].next_id;

    const result = await query(
      `INSERT INTO projects (
        project_no, name, aka, fka, type, genre, casting_status, "union",
        start_date, end_date, description, musical, publish, archived,
        city1, state1, country1, city2, state2, country2
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) 
      RETURNING *`,
      [
        nextProjectNo, name, aka, fka, type, genre, casting_status, union,
        start_date, end_date, description, musical, publish, archived,
        city1, state1, country1, city2, state2, country2
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
