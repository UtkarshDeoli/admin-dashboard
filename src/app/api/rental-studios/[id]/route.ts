import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const result = await query(`
      SELECT rs.*, c.name as company_name 
      FROM rental_studios rs
      JOIN companies c ON rs.company_no = c.company_no
      WHERE rs.studio_no = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Rental studio not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching rental studio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rental studio' },
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
            name,
            num_studios,
            rate,
            rate_frequency,
            archived
        } = body;

        const result = await query(
            `UPDATE rental_studios SET
                company_no = $1, address_no = $2, name = $3, num_studios = $4, rate = $5,
                rate_frequency = $6, archived = $7
             WHERE studio_no = $8 
             RETURNING *`,
            [
                company_no, address_no, name, num_studios, rate,
                rate_frequency, archived, id
            ]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Rental studio not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating rental studio:', error);
        return NextResponse.json(
            { error: 'Failed to update rental studio' },
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
    const result = await query('DELETE FROM rental_studios WHERE studio_no = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Rental studio not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Rental studio deleted successfully' });
  } catch (error) {
    console.error('Error deleting rental studio:', error);
    return NextResponse.json(
      { error: 'Failed to delete rental studio' },
      { status: 500 }
    );
  }
}