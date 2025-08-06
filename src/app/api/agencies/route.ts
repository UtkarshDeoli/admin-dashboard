import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT a.*, c.name as company_name 
      FROM agencies a
      JOIN companies c ON a.company_no = c.company_no
      WHERE a.archived = false
      ORDER BY a.agency_no
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching agencies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agencies' },
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
      unions,
      submission_preference,
      represents,
      does_not_represent,
      market,
      seeks,
      literary_only,
      bi_coastal,
      freelance,
      talent,
      seeking,
      represents_min_age,
      represents_max_age,
      seeking_min_age,
      seeking_max_age
    } = body;

    // Get the next agency_no
    const maxResult = await query('SELECT COALESCE(MAX(agency_no), 0) + 1 as next_id FROM agencies');
    const nextAgencyNo = maxResult.rows[0].next_id;

    const result = await query(
      `INSERT INTO agencies (
        agency_no, company_no, address_no, contact1, contact2, unions, submission_preference,
        represents, does_not_represent, market, seeks, literary_only, bi_coastal, freelance,
        talent, seeking, represents_min_age, represents_max_age, seeking_min_age, seeking_max_age, archived
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, false
      ) RETURNING *`,
      [
        nextAgencyNo, company_no, address_no, contact1, contact2, unions, submission_preference,
        represents, does_not_represent, market, seeks, literary_only || false, bi_coastal || false,
        freelance || false, talent || false, seeking || false, represents_min_age || 0,
        represents_max_age || 0, seeking_min_age || 0, seeking_max_age || 0
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating agency:', error);
    return NextResponse.json(
      { error: 'Failed to create agency' },
      { status: 500 }
    );
  }
}
