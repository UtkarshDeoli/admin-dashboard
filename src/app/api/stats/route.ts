import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const [companiesResult, addressesResult, peopleResult, projectsResult] = await Promise.all([
      query('SELECT COUNT(*) as count FROM companies'),
      query('SELECT COUNT(*) as count FROM addresses'),
      query('SELECT COUNT(*) as count FROM people'),
      query('SELECT COUNT(*) as count FROM projects')
    ]);

    return NextResponse.json({
      companies: parseInt(companiesResult.rows[0].count),
      addresses: parseInt(addressesResult.rows[0].count),
      people: parseInt(peopleResult.rows[0].count),
      projects: parseInt(projectsResult.rows[0].count),
      total: parseInt(companiesResult.rows[0].count) + 
             parseInt(addressesResult.rows[0].count) + 
             parseInt(peopleResult.rows[0].count) + 
             parseInt(projectsResult.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
