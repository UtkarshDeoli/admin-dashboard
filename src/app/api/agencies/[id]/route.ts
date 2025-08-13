import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const result = await query(`
      SELECT a.*, c.name as company_name 
      FROM agencies a
      JOIN companies c ON a.company_no = c.company_no
      WHERE a.agency_no = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching agency:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agency' },
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
      seeking_max_age,
      archived
    } = body;

    const result = await query(
      `UPDATE agencies SET
        company_no = $1, address_no = $2, contact1 = $3, contact2 = $4, unions = $5,
        submission_preference = $6, represents = $7, does_not_represent = $8, market = $9,
        seeks = $10, literary_only = $11, bi_coastal = $12, freelance = $13, talent = $14,
        seeking = $15, represents_min_agee = $16, represents_max_age = $17, seeking_min_age = $18,
        seeking_max_age = $19, archived = $20
       WHERE agency_no = $21 
       RETURNING *`,
      [
        company_no, address_no, contact1, contact2, unions, submission_preference,
        represents, does_not_represent, market, seeks, literary_only, bi_coastal,
        freelance, talent, seeking, represents_min_age, represents_max_age,
        seeking_min_age, seeking_max_age, archived, id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating agency:', error);
    return NextResponse.json(
      { error: 'Failed to update agency' },
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
    const result = await query('DELETE FROM agencies WHERE agency_no = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Agency deleted successfully' });
  } catch (error) {
    console.error('Error deleting agency:', error);
    return NextResponse.json(
      { error: 'Failed to delete agency' },
      { status: 500 }
    );
  }
}
