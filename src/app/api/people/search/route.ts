import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    const result = await query('SELECT * FROM people WHERE  first_name ILIKE $1 OR last_name ILIKE $1 OR middle_name ILIKE $1 OR no_book ILIKE $1 ORDER BY people_no', [`%${query}%`]);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching people count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch people count' },
      { status: 500 }
    );
  }
}
