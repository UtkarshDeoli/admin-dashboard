import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT rs.*, c.name as company_name 
      FROM rental_studios rs
      JOIN companies c ON rs.company_no = c.company_no
      WHERE rs.archived = false
      ORDER BY rs.studio_no
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching rental studios:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rental studios' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company_no, address_no, name, num_studios, rate, rate_frequency } = body;

    const maxResult = await query('SELECT COALESCE(MAX(studio_no), 0) + 1 as next_id FROM rental_studios');
    const nextStudioNo = maxResult.rows[0].next_id;

    const result = await query(
      `INSERT INTO rental_studios (studio_no, company_no, address_no, name, num_studios, rate, rate_frequency, archived) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, false) RETURNING *`,
      [nextStudioNo, company_no, address_no, name, num_studios || 1, rate || 0, rate_frequency || 'Hourly']
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating rental studio:', error);
    return NextResponse.json(
      { error: 'Failed to create rental studio' },
      { status: 500 }
    );
  }
}
