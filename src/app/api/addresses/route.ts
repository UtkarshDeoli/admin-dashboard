import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const result = await query('SELECT * FROM addresses ORDER BY address_no');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return NextResponse.json(
            { error: 'Failed to fetch addresses' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      line1, line2, line3, city, state, zip, country,
      phone1, phone2, phone3, email1, email2, 
      website1, website2, fax, verified 
    } = body;

    // Get the next address_no manually since we don't have sequence permissions
    const maxResult = await query('SELECT COALESCE(MAX(address_no), 0) + 1 as next_id FROM addresses');
    const nextAddressNo = maxResult.rows[0].next_id;

    const result = await query(
      `INSERT INTO addresses (
        address_no, line1, line2, line3, city, state, zip, country,
        phone1, phone2, phone3, email1, email2,
        website1, website2, fax, verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
      RETURNING *`,
      [
        nextAddressNo, line1, line2, line3, city, state, zip, country,
        phone1, phone2, phone3, email1, email2,
        website1, website2, fax, verified
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    );
  }
}
