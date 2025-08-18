import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const entity_type = request.nextUrl.searchParams.get('entity_type');
    const entity_no = request.nextUrl.searchParams.get('entity_no');
    
    if (!entity_type || !entity_no) {
      return NextResponse.json(
        { error: 'Missing required parameters: entity_type and entity_no' },
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
    
    const result = await query(
      'SELECT * FROM privacy_settings WHERE entity_type = $1 AND entity_no = $2 ORDER BY field_name',
      [entity_type, parseInt(entity_no)]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching privacy settings by entity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch privacy settings by entity' },
      { status: 500 }
    );
  }
}
