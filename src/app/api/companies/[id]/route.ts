import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const result = await query('SELECT * FROM companies WHERE company_no = $1', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company' },
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
    const { name, description, fka, acronym, verified, archived } = body;

    const result = await query(
      `UPDATE companies 
       SET name = $1, description = $2, fka = $3, acronym = $4, verified = $5, archived = $6
       WHERE company_no = $7
       RETURNING *`,
      [name, description, fka, acronym, verified, archived, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { error: 'Failed to update company' },
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
    
    // Start a transaction to delete related records
    await query('BEGIN');
    
    try {
      // Delete related records from specific company type tables
      await query('DELETE FROM agencies WHERE company_no = $1', [id]);
      await query('DELETE FROM casting WHERE company_no = $1', [id]);
      await query('DELETE FROM rental_spaces WHERE company_no = $1', [id]);
      await query('DELETE FROM theaters WHERE company_no = $1', [id]);
      await query('DELETE FROM rental_studios WHERE company_no = $1', [id]);
      await query('DELETE FROM schools WHERE company_no = $1', [id]);
      
      // Delete company addresses
      await query('DELETE FROM company_addresses WHERE company_no = $1', [id]);
      
      // Delete the company
      const result = await query('DELETE FROM companies WHERE company_no = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        await query('ROLLBACK');
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        );
      }

      await query('COMMIT');
      return NextResponse.json({ message: 'Company deleted successfully' });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    );
  }
}
