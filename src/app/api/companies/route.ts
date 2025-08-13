import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Company } from '@/types/company';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type');
    
    let sql = 'SELECT * FROM companies';
    let params: any[] = [];
    
    if (type && type !== 'All') {
      sql += ' WHERE company_type = $1';
      params.push(type);
    }
    
    sql += ' ORDER BY company_no';
    
    const result = await query(sql, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, fka, acronym, verified, company_type, archived } = body;

    // Get the next company_no manually since we don't have sequence permissions
    const maxResult = await query('SELECT COALESCE(MAX(company_no), 0) + 1 as next_id FROM companies');
    const nextCompanyNo = maxResult.rows[0].next_id;

    const result = await query(
      `INSERT INTO companies (company_no, name, description, fka, acronym, verified, archived) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [nextCompanyNo, name, description, fka, acronym, verified || false, archived || false]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}
