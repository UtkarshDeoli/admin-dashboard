import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; addressId: string } }
) {
  try {
    const companyId = params.id;
    const addressId = params.addressId;

    const result = await query(
      'UPDATE company_addresses SET archived = true WHERE company_no = $1 AND address_no = $2 RETURNING *',
      [companyId, addressId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Company address relationship not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Address removed from company successfully' });
  } catch (error) {
    console.error('Error removing address from company:', error);
    return NextResponse.json(
      { error: 'Failed to remove address from company' },
      { status: 500 }
    );
  }
}
