import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const peopleId = params.id;
    const includeArchived = request.nextUrl.searchParams.get('includeArchived') === 'true';
    
    let whereClause = 'WHERE pa.people_no = $1';
    if (!includeArchived) {
      whereClause += ' AND pa.archived = false';
    }
    
    const result = await query(`
      SELECT a.*, pa.archived as relationship_archived, pa.id as relationship_id
      FROM addresses a
      JOIN people_addresses pa ON a.address_no = pa.address_no
      ${whereClause}
      ORDER BY a.address_no
    `, [peopleId]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching people addresses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch people addresses' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const peopleId = params.id;
    const body = await request.json();
    const { address_no } = body;

    // Check if the relationship already exists
    const existingResult = await query(
      'SELECT * FROM people_addresses WHERE people_no = $1 AND address_no = $2',
      [peopleId, address_no]
    );

    if (existingResult.rows.length > 0) {
      // Update existing relationship to unarchive it
      await query(
        'UPDATE people_addresses SET archived = false WHERE people_no = $1 AND address_no = $2',
        [peopleId, address_no]
      );
    } else {
      // Create new relationship
      await query(
        'INSERT INTO people_addresses (people_no, address_no, archived) VALUES ($1, $2, false)',
        [peopleId, address_no]
      );
    }

    return NextResponse.json({ message: 'Address added to person successfully' });
  } catch (error) {
    console.error('Error adding address to person:', error);
    return NextResponse.json(
      { error: 'Failed to add address to person' },
      { status: 500 }
    );
  }
}
