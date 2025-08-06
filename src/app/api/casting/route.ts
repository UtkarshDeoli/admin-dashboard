import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT c.*, comp.name as company_name 
      FROM casting c
      JOIN companies comp ON c.company_no = comp.company_no
      WHERE c.archived = false
      ORDER BY c.casting_company_no
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching casting companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch casting companies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      company_no,
      address_no,
      contact1,
      contact2,
      submission_preference,
      casts_for,
      seeking,
      market,
      unions,
      talk_variety,
      bi_coastal,
      primetime
    } = body;

    // Get the next casting_company_no
    const maxResult = await query('SELECT COALESCE(MAX(casting_company_no), 0) + 1 as next_id FROM casting');
    const nextCastingNo = maxResult.rows[0].next_id;

    const result = await query(
      `INSERT INTO casting (
        casting_company_no, company_no, address_no, contact1, contact2, submission_preference,
        casts_for, seeking, market, unions, talk_variety, bi_coastal, primetime, archived
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, false
      ) RETURNING *`,
      [
        nextCastingNo, company_no, address_no, contact1, contact2, submission_preference,
        casts_for, seeking, market, unions, talk_variety || false, bi_coastal || false,
        primetime || false
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating casting company:', error);
    return NextResponse.json(
      { error: 'Failed to create casting company' },
      { status: 500 }
    );
  }
}
