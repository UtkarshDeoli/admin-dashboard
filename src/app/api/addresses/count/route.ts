import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT COUNT(*) FROM addresses');
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching address count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch address count' },
      { status: 500 }
    );
  }
}
