import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const result = await query('SELECT * FROM addresses WHERE address_no = $1', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching address:', error);
    return NextResponse.json(
      { error: 'Failed to fetch address' },
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
      line1, line2, line3, city, state, zip, country,
      phone1, phone2, phone3, email1, email2, 
      website1, website2, fax, verified 
    } = body;

    const result = await query(
      `UPDATE addresses 
       SET line1 = $1, line2 = $2, line3 = $3, city = $4, state = $5, zip = $6, country = $7,
           phone1 = $8, phone2 = $9, phone3 = $10, email1 = $11, email2 = $12,
           website1 = $13, website2 = $14, fax = $15, verified = $16
       WHERE address_no = $17 
       RETURNING *`,
      [
        line1, line2, line3, city, state, zip, country,
        phone1, phone2, phone3, email1, email2,
        website1, website2, fax, verified, id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Failed to update address' },
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
    const result = await query('DELETE FROM addresses WHERE address_no = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
