import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT s.*, c.name as company_name 
      FROM schools s
      JOIN companies c ON s.company_no = c.company_no
      WHERE s.archived = false
      ORDER BY s.school_no
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      company_no,
      policy,
      technique,
      audit,
      coaching,
      showcase,
      bi_coastal,
      online,
      in_person,
      class_size_min,
      class_size_max,
      age_min,
      age_max
    } = body;

    const maxResult = await query('SELECT COALESCE(MAX(school_no), 0) + 1 as next_id FROM schools');
    const nextSchoolNo = maxResult.rows[0].next_id;

    const result = await query(
      `INSERT INTO schools (
        school_no, company_no, policy, technique, audit, coaching, showcase, 
        bi_coastal, online, in_person, class_size_min, class_size_max, 
        age_min, age_max, archived
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, false) RETURNING *`,
      [
        nextSchoolNo, company_no, policy, technique, audit || false, coaching || false,
        showcase || false, bi_coastal || false, online || false, in_person || false,
        class_size_min || 0, class_size_max || 0, age_min || 0, age_max || 0
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating school:', error);
    return NextResponse.json(
      { error: 'Failed to create school' },
      { status: 500 }
    );
  }
}
