import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    const includeArchived = request.nextUrl.searchParams.get('includeArchived') === 'true';
    
    let whereClause = 'WHERE ca.company_no = $1';
    if (!includeArchived) {
      whereClause += ' AND ca.archived = false';
    }
    
    const result = await query(`
      SELECT a.*, ca.archived as relationship_archived, ca.locaction 
      FROM addresses a
      JOIN company_addresses ca ON a.address_no = ca.address_no
      ${whereClause}
      ORDER BY a.address_no
    `, [companyId]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching company addresses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company addresses' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    const body = await request.json();
    const { address_no, locaction } = body;

    // Check if the relationship already exists
    const existingResult = await query(
      'SELECT * FROM company_addresses WHERE company_no = $1 AND address_no = $2',
      [companyId, address_no]
    );

    if (existingResult.rows.length > 0) {
      // Update existing relationship
      await query(
        'UPDATE company_addresses SET archived = false, locaction = $1 WHERE company_no = $2 AND address_no = $3',
        [locaction || '', companyId, address_no]
      );
    } else {
      // Create new relationship
      await query(
        'INSERT INTO company_addresses (company_no, address_no, locaction, archived) VALUES ($1, $2, $3, false)',
        [companyId, address_no, locaction || '']
      );
    }

    return NextResponse.json({ message: 'Address added to company successfully' });
  } catch (error) {
    console.error('Error adding address to company:', error);
    return NextResponse.json(
      { error: 'Failed to add address to company' },
      { status: 500 }
    );
  }
}
