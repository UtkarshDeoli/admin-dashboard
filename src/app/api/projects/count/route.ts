import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT COUNT(*) FROM projects');
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching projects count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects count' },
      { status: 500 }
    );
  }
}
