import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; addressId: string } }
) {
  try {
    const companyId = params.id;
    const addressId = params.addressId;

    // Delete the relationship between company and address
    await query(
      'DELETE FROM company_addresses WHERE company_no = $1 AND address_no = $2',
      [companyId, addressId]
    );

    return NextResponse.json({ message: 'Address removed from company successfully' });
  } catch (error) {
    console.error('Error removing address from company:', error);
    return NextResponse.json(
      { error: 'Failed to remove address from company' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; addressId: string } }
) {
  try {
    const companyId = params.id;
    const addressId = params.addressId;
    const body = await request.json();
    const { archived, locaction } = body;

    // Update the relationship between company and address
    await query(
      'UPDATE company_addresses SET archived = $1, locaction = $2 WHERE company_no = $3 AND address_no = $4',
      [archived, locaction || '', companyId, addressId]
    );

    return NextResponse.json({ message: 'Company address updated successfully' });
  } catch (error) {
    console.error('Error updating company address:', error);
    return NextResponse.json(
      { error: 'Failed to update company address' },
      { status: 500 }
    );
  }
}
