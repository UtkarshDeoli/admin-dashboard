import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCompaniesByTypeDB } from '@/lib/server-utils';
import { CompanyType } from '@/types/company';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchQuery = request.nextUrl.searchParams.get('query');
    const type = request.nextUrl.searchParams.get('type');
    
    if (!searchQuery && !type) {
      return NextResponse.json(
        { error: 'Search query or type filter is required' },
        { status: 400 }
      );
    }

    let sql = 'SELECT * FROM companies WHERE 1=1';
    let params: any[] = [];
    let paramIndex = 1;

    // Add text search if provided
    if (searchQuery) {
      sql += ` AND (
        LOWER(name) LIKE LOWER($${paramIndex}) OR 
        LOWER(description) LIKE LOWER($${paramIndex}) OR 
        LOWER(fka) LIKE LOWER($${paramIndex}) OR 
        LOWER(acronym) LIKE LOWER($${paramIndex})
      )`;
      params.push(`%${searchQuery}%`);
      paramIndex++;
    }

    // Handle company type filtering
    if (type && type !== 'All' && type !== '') {
      try {
        // Get companies that match the specified type
        const companyNosWithType = await getCompaniesByTypeDB(type as CompanyType);
        
        if (companyNosWithType.length === 0) {
          // No companies found with this type
          return NextResponse.json([]);
        }
        
        // Add type filter to SQL
        const placeholders = companyNosWithType.map((_, index: number) => `$${paramIndex + index}`).join(',');
        sql += ` AND company_no IN (${placeholders})`;
        params.push(...companyNosWithType);
      } catch (error) {
        console.error('Error filtering by company type:', error);
        // Continue without type filter if there's an error
      }
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
