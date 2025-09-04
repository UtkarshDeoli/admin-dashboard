import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      'SELECT unnest(enum_range(NULL::system.play_type)) AS enum_values ORDER BY enum_values'
    );
    
    const enumValues = result.rows.map(row => row.enum_values);
    return NextResponse.json(enumValues);
  } catch (error) {
    console.error('Error fetching play types:', error);
    return NextResponse.json({ error: 'Failed to fetch play types' }, { status: 500 });
  }
}
