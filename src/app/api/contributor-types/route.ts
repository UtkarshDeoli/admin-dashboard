import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      `SELECT unnest(enum_range(NULL::system.play_contributor_type)) AS enum_values ORDER BY enum_values`
    );

    const values = result.rows.map((r: any) => r.enum_values);
    return NextResponse.json(values);
  } catch (error) {
    console.error('Error fetching contributor types:', error);
    return NextResponse.json({ error: 'Failed to fetch contributor types' }, { status: 500 });
  }
}
