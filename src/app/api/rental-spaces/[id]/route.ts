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
      FROM rental_spaces rs
      JOIN companies c ON rs.company_no = c.company_no
      WHERE rs.space_no = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Rental space not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching rental space:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rental space' },
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
            dimensions,
            seats,
            space_type,
            archived
        } = body;

        const result = await query(
            `UPDATE rental_spaces SET
                company_no = $1, address_no = $2, name = $3, dimensions = $4, seats = $5,
                space_type = $6, archived = $7
             WHERE space_no = $8 
             RETURNING *`,
            [
                company_no, address_no, name, dimensions, seats,
                space_type, archived, id
            ]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Rental space not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating rental space:', error);
        return NextResponse.json(
            { error: 'Failed to update rental space' },
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
    const result = await query('DELETE FROM rental_spaces WHERE space_no = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Rental space not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Rental space deleted successfully' });
  } catch (error) {
    console.error('Error deleting rental space:', error);
    return NextResponse.json(
      { error: 'Failed to delete rental space' },
      { status: 500 }
    );
  }
}