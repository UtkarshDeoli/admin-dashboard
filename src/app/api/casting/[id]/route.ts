import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const result = await query(`
      SELECT a.*, c.name as company_name 
      FROM casting a
      JOIN companies c ON a.company_no = c.company_no
      WHERE a.casting_company_no = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Casting company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching Casting company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Casting company' },
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
            address_no,
            contact1,
            contact2,
            submission_preference,
            casts_for,
            seeking,
            market,
            unions,
            talk_variey,
            bi_coastal,
            primetime
        } = body;

        const result = await query(
            `UPDATE casting SET
                company_no = $1, address_no = $2, contact1 = $3, contact2 = $4, submission_preference = $5,
                casts_for = $6, seeking = $7, market = $8, unions = $9, talk_variey = $10,
                bi_coastal = $11, primetime = $12
             WHERE casting_company_no = $13 
             RETURNING *`,
            [
                company_no, address_no, contact1, contact2, submission_preference,
                casts_for, seeking, market, unions, talk_variey,
                bi_coastal, primetime, id
            ]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Casting company not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating Casting company:', error);
        return NextResponse.json(
            { error: 'Failed to update Casting company' },
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
    const result = await query('DELETE FROM casting WHERE casting_company_no = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Casting company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Casting company deleted successfully' });
  } catch (error) {
    console.error('Error deleting Casting company:', error);
    return NextResponse.json(
      { error: 'Failed to delete Casting company' },
      { status: 500 }
    );
  }
}
