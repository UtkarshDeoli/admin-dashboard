import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT rs.*, c.name as company_name 
      FROM rental_spaces rs
      JOIN companies c ON rs.company_no = c.company_no
      WHERE rs.archived = false
      ORDER BY rs.space_no
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching rental spaces:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rental spaces' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company_no, address_no, name, dimensions, seats, space_type } = body;

    const maxResult = await query('SELECT COALESCE(MAX(space_no), 0) + 1 as next_id FROM rental_spaces');
    const nextSpaceNo = maxResult.rows[0].next_id;

    const result = await query(
      `INSERT INTO rental_spaces (space_no, company_no, address_no, name, dimensions, seats, space_type, archived) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, false) RETURNING *`,
      [nextSpaceNo, company_no, address_no, name, dimensions, seats || 0, space_type]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating rental space:', error);
    return NextResponse.json(
      { error: 'Failed to create rental space' },
      { status: 500 }
    );
  }
}
