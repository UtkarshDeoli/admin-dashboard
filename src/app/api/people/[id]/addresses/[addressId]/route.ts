import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; addressId: string } }
) {
  try {
    const peopleId = params.id;
    const addressId = params.addressId;

    // Delete the relationship between person and address
    await query(
      'DELETE FROM people_addresses WHERE people_no = $1 AND address_no = $2',
      [peopleId, addressId]
    );

    return NextResponse.json({ message: 'Address removed from person successfully' });
  } catch (error) {
    console.error('Error removing address from person:', error);
    return NextResponse.json(
      { error: 'Failed to remove address from person' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; addressId: string } }
) {
  try {
    const peopleId = params.id;
    const addressId = params.addressId;
    const body = await request.json();
    const { archived } = body;

    // Update the relationship between person and address
    await query(
      'UPDATE people_addresses SET archived = $1 WHERE people_no = $2 AND address_no = $3',
      [archived, peopleId, addressId]
    );

    return NextResponse.json({ message: 'Person address updated successfully' });
  } catch (error) {
    console.error('Error updating person address:', error);
    return NextResponse.json(
      { error: 'Failed to update person address' },
      { status: 500 }
    );
  }
}
