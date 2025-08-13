import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const result = await query(`
      SELECT t.*, c.name as company_name 
      FROM theaters t
      JOIN companies c ON t.company_no = c.company_no
      WHERE t.theater_no = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Theater not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching theater:', error);
    return NextResponse.json(
      { error: 'Failed to fetch theater' },
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
            submission_preference,
            literary_submission_preference,
            contract,
            production_compnay,
            summer,
            musical,
            community,
            outdoor,
            archived
        } = body;

        const result = await query(
            `UPDATE theaters SET
                company_no = $1, submission_preference = $2, literary_submission_preference = $3, 
                contract = $4, production_compnay = $5, summer = $6, musical = $7, 
                community = $8, outdoor = $9, archived = $10
             WHERE theater_no = $11 
             RETURNING *`,
            [
                company_no, submission_preference, literary_submission_preference,
                contract, production_compnay, summer, musical,
                community, outdoor, archived, id
            ]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Theater not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating theater:', error);
        return NextResponse.json(
            { error: 'Failed to update theater' },
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
    const result = await query('DELETE FROM theaters WHERE theater_no = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Theater not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Theater deleted successfully' });
  } catch (error) {
    console.error('Error deleting theater:', error);
    return NextResponse.json(
      { error: 'Failed to delete theater' },
      { status: 500 }
    );
  }
}