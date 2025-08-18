import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, is_private_online, is_private_publication } = body;

    // Validation
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid ids array' },
        { status: 400 }
      );
    }

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];
    let paramCount = 0;

    if (is_private_online !== undefined) {
      paramCount++;
      updateFields.push(`is_private_online = $${paramCount}`);
      updateValues.push(is_private_online);
    }

    if (is_private_publication !== undefined) {
      paramCount++;
      updateFields.push(`is_private_publication = $${paramCount}`);
      updateValues.push(is_private_publication);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No valid update fields provided' },
        { status: 400 }
      );
    }

    // Create placeholders for the IDs
    const idPlaceholders = ids.map((_, index) => `$${paramCount + index + 1}`).join(', ');
    const allParams = [...updateValues, ...ids.map(id => parseInt(id))];

    const sql = `UPDATE privacy_settings 
                 SET ${updateFields.join(', ')} 
                 WHERE id IN (${idPlaceholders}) 
                 RETURNING *`;

    const result = await query(sql, allParams);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error bulk updating privacy settings:', error);
    return NextResponse.json(
      { error: 'Failed to bulk update privacy settings' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    // Validation
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid ids array' },
        { status: 400 }
      );
    }

    // Create placeholders for the IDs
    const idPlaceholders = ids.map((_, index) => `$${index + 1}`).join(', ');
    const params = ids.map(id => parseInt(id));

    // First, get the privacy settings that will be deleted for response
    const selectResult = await query(
      `SELECT * FROM privacy_settings WHERE id IN (${idPlaceholders})`,
      params
    );

    // Delete the privacy settings
    const deleteResult = await query(
      `DELETE FROM privacy_settings WHERE id IN (${idPlaceholders})`,
      params
    );

    return NextResponse.json({
      message: `Deleted ${deleteResult.rowCount} privacy settings`,
      deleted: selectResult.rows
    });
  } catch (error) {
    console.error('Error bulk deleting privacy settings:', error);
    return NextResponse.json(
      { error: 'Failed to bulk delete privacy settings' },
      { status: 500 }
    );
  }
}
