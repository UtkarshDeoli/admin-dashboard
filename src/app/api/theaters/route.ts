import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT t.*, c.name as company_name 
      FROM theaters t
      JOIN companies c ON t.company_no = c.company_no
      WHERE t.archived = false
      ORDER BY t.theater_no
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching theaters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch theaters' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      company_no,
      submission_preference,
      literary_submission_preference,
      contract,
      production_compnay,
      summer,
      musical,
      community,
      outdoor
    } = body;

    const maxResult = await query('SELECT COALESCE(MAX(theater_no), 0) + 1 as next_id FROM theaters');
    const nextTheaterNo = maxResult.rows[0].next_id;

    const result = await query(
      `INSERT INTO theaters (
        theater_no, company_no, submission_preference, literary_submission_preference, 
        contract, production_compnay, summer, musical, community, outdoor, archived
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, false) RETURNING *`,
      [
        nextTheaterNo, company_no, submission_preference, literary_submission_preference,
        contract, production_compnay || false, summer || false, musical || false,
        community || false, outdoor || false
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating theater:', error);
    return NextResponse.json(
      { error: 'Failed to create theater' },
      { status: 500 }
    );
  }
}
