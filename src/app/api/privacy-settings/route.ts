import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { PrivacySetting } from '@/types/company';

export const dynamic = 'force-dynamic';

// Ensure the privacy_settings table exists
async function ensureTableExists() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS privacy_settings (
        id SERIAL PRIMARY KEY,
        entity_type entity_type NOT NULL,
        entity_id INTEGER NOT NULL,
        field_name VARCHAR(255) NOT NULL,
        is_private_online BOOLEAN DEFAULT false,
        is_private_publication BOOLEAN DEFAULT false,
        UNIQUE(entity_type, entity_id, field_name)
      )
    `);
  } catch (error) {
    console.error('Error ensuring table exists:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureTableExists();
    
    const entity_type = request.nextUrl.searchParams.get('entity_type');
    const entity_no = request.nextUrl.searchParams.get('entity_no');
    const field_name = request.nextUrl.searchParams.get('field_name');
    const online_private = request.nextUrl.searchParams.get('online_private');
    const publication_private = request.nextUrl.searchParams.get('publication_private');
    
    let sql = 'SELECT * FROM privacy_settings WHERE 1=1';
    let params: any[] = [];
    let paramCount = 0;
    
    if (entity_type) {
      paramCount++;
      sql += ` AND entity_type = $${paramCount}`;
      params.push(entity_type);
    }
    
    if (entity_no) {
      paramCount++;
      sql += ` AND entity_no = $${paramCount}`;
      params.push(parseInt(entity_no));
    }
    
    if (field_name) {
      paramCount++;
      sql += ` AND field_name = $${paramCount}`;
      params.push(field_name);
    }
    
    if (online_private !== null && online_private !== undefined) {
      paramCount++;
      sql += ` AND is_private_online = $${paramCount}`;
      params.push(online_private === 'true');
    }
    
    if (publication_private !== null && publication_private !== undefined) {
      paramCount++;
      sql += ` AND is_private_publication = $${paramCount}`;
      params.push(publication_private === 'true');
    }
    
    sql += ' ORDER BY id';
    
    const result = await query(sql, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching privacy settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch privacy settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTableExists();
    
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

    // Check if privacy setting already exists
    const existingResult = await query(
      'SELECT id FROM privacy_settings WHERE entity_type = $1 AND entity_no = $2 AND field_name = $3',
      [entity_type, entity_no, field_name]
    );

    if (existingResult.rows.length > 0) {
      // Update existing record
      const result = await query(
        `UPDATE privacy_settings 
         SET is_private_online = $1, is_private_publication = $2
         WHERE entity_type = $3 AND entity_no = $4 AND field_name = $5
         RETURNING *`,
        [is_private_online || false, is_private_publication || false, entity_type, entity_no, field_name]
      );
      return NextResponse.json(result.rows[0], { status: 200 });
    } else {
      // Insert new record
      const result = await query(
        `INSERT INTO privacy_settings (entity_type, entity_no, field_name, is_private_online, is_private_publication) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [entity_type, entity_no, field_name, is_private_online || false, is_private_publication || false]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    }
  } catch (error) {
    console.error('Error creating privacy setting:', error);
    return NextResponse.json(
      { error: 'Failed to create privacy setting' },
      { status: 500 }
    );
  }
}
