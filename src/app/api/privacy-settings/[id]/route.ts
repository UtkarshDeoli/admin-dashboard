import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const result = await query(
      'SELECT * FROM privacy_settings WHERE id = $1',
      [parseInt(id)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Privacy setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching privacy setting:', error);
    return NextResponse.json(
      { error: 'Failed to fetch privacy setting' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { entity_no, entity_type, field_name, is_private_online, is_private_publication } = body;

    // Validation
    if (!entity_no || !entity_type || !field_name) {
      return NextResponse.json(
        { error: 'Missing required fields: entity_no, entity_type, field_name' },
        { status: 400 }
      );
    }

    // Validate entity_type
    const validEntityTypes = ['Company', 'People', 'Address', 'Agency'];
    if (!validEntityTypes.includes(entity_type)) {
      return NextResponse.json(
        { error: `Invalid entity_type. Must be one of: ${validEntityTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if privacy setting exists
    const existingResult = await query(
      'SELECT id FROM privacy_settings WHERE id = $1',
      [parseInt(id)]
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Privacy setting not found' },
        { status: 404 }
      );
    }

    // Check if another privacy setting exists for this entity and field (excluding current one)
    const duplicateResult = await query(
      'SELECT id FROM privacy_settings WHERE entity_no = $1 AND entity_type = $2 AND field_name = $3 AND id != $4',
      [entity_no, entity_type, field_name, parseInt(id)]
    );

    if (duplicateResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'Privacy setting already exists for this entity and field' },
        { status: 409 }
      );
    }

    const result = await query(
      `UPDATE privacy_settings 
       SET entity_no = $1, entity_type = $2, field_name = $3, is_private_online = $4, is_private_publication = $5
       WHERE id = $6 
       RETURNING *`,
      [entity_no, entity_type, field_name, is_private_online || false, is_private_publication || false, parseInt(id)]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating privacy setting:', error);
    return NextResponse.json(
      { error: 'Failed to update privacy setting' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if privacy setting exists
    const existingResult = await query(
      'SELECT id FROM privacy_settings WHERE id = $1',
      [parseInt(id)]
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Privacy setting not found' },
        { status: 404 }
      );
    }

    await query('DELETE FROM privacy_settings WHERE id = $1', [parseInt(id)]);

    return NextResponse.json({ message: 'Privacy setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting privacy setting:', error);
    return NextResponse.json(
      { error: 'Failed to delete privacy setting' },
      { status: 500 }
    );
  }
}
