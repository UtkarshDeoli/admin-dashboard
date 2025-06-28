import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM people ORDER BY people_no');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json(
      { error: 'Failed to fetch people' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { first_name, middle_name, last_name, address_no, no_book, archived } = body;

    // Get the next people_no manually since we don't have sequence permissions
    const maxResult = await query('SELECT COALESCE(MAX(people_no), 0) + 1 as next_id FROM people');
    const nextPeopleNo = maxResult.rows[0].next_id;

    const result = await query(
      `INSERT INTO people (people_no, first_name, middle_name, last_name, address_no, no_book, archived) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [nextPeopleNo, first_name, middle_name, last_name, address_no, no_book, archived]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating person:', error);
    return NextResponse.json(
      { error: 'Failed to create person' },
      { status: 500 }
    );
  }
}
