import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const result = await query(`
      SELECT s.*, c.name as company_name 
      FROM schools s
      JOIN companies c ON s.company_no = c.company_no
      WHERE s.school_no = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching school:', error);
    return NextResponse.json(
      { error: 'Failed to fetch school' },
      { status: 500 }
    );
  }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
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
            age_max,
            archived
        } = body;

        const result = await query(
            `UPDATE schools SET
                company_no = $1, policy = $2, technique = $3, audit = $4, coaching = $5,
                showcase = $6, bi_coastal = $7, online = $8, in_person = $9, class_size_min = $10,
                class_size_max = $11, age_min = $12, age_max = $13, archived = $14
             WHERE school_no = $15 
             RETURNING *`,
            [
                company_no, policy, technique, audit, coaching,
                showcase, bi_coastal, online, in_person, class_size_min,
                class_size_max, age_min, age_max, archived, id
            ]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'School not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating school:', error);
        return NextResponse.json(
            { error: 'Failed to update school' },
            { status: 500 }
        );
    }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const result = await query('DELETE FROM schools WHERE school_no = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'School deleted successfully' });
  } catch (error) {
    console.error('Error deleting school:', error);
    return NextResponse.json(
      { error: 'Failed to delete school' },
      { status: 500 }
    );
  }
}