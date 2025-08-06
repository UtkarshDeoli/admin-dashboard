import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('query');
    const type = searchParams.get('type');
    
    if (!searchQuery) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    let sql = `
      SELECT * FROM companies 
      WHERE (
        LOWER(name) LIKE LOWER($1) OR 
        LOWER(description) LIKE LOWER($1) OR 
        LOWER(fka) LIKE LOWER($1) OR 
        LOWER(acronym) LIKE LOWER($1)
      )
    `;
    
    let params = [`%${searchQuery}%`];
    
    if (type && type !== 'All') {
      sql += ' AND company_type = $2';
      params.push(type);
    }
    
    sql += ' ORDER BY name';
    
    const result = await query(sql, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error searching companies:', error);
    return NextResponse.json(
      { error: 'Failed to search companies' },
      { status: 500 }
    );
  }
}
