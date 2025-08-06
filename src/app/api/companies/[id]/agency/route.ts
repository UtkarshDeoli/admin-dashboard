import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    const result = await query(
      'SELECT * FROM agencies WHERE company_no = $1 AND archived = false',
      [companyId]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Agency not found for this company' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching agency by company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agency' },
      { status: 500 }
    );
  }
}
