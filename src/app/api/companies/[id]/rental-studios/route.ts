import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    const result = await query(
      'SELECT * FROM rental_studios WHERE company_no = $1 AND archived = false',
      [companyId]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'rental_studios not found for this company' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching rental_studios by company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rental_studios' },
      { status: 500 }
    );
  }
}
