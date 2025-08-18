import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const entity_type = request.nextUrl.searchParams.get('entity_type');
    
    if (!entity_type) {
      // Return all available entity types and their common fields
      const entityFields = {
        Company: [
          'name', 'description', 'fka', 'acronym', 'verified', 'archived'
        ],
        People: [
          'first_name', 'middle_name', 'last_name', 'no_book', 'archived'
        ],
        Address: [
          'line1', 'line2', 'line3', 'city', 'state', 'zip', 'country', 
          'phone1', 'phone2', 'phone3', 'email1', 'email2', 'website1', 
          'website2', 'fax', 'verified'
        ],
        Agency: [
          'contact1', 'contact2', 'unions', 'submission_preference', 'represents',
          'does_not_represent', 'market', 'seeks', 'literary_only', 'bi_coastal',
          'freelance', 'talent', 'seeking', 'represents_min_age', 'represents_max_age',
          'seeking_min_age', 'seeking_max_age', 'archived'
        ]
      };

      return NextResponse.json(entityFields);
    }

    // Return fields for specific entity type
    const entityFields = {
      Company: [
        'name', 'description', 'fka', 'acronym', 'verified', 'archived'
      ],
      People: [
        'first_name', 'middle_name', 'last_name', 'no_book', 'archived'
      ],
      Address: [
        'line1', 'line2', 'line3', 'city', 'state', 'zip', 'country', 
        'phone1', 'phone2', 'phone3', 'email1', 'email2', 'website1', 
        'website2', 'fax', 'verified'
      ],
      Agency: [
        'contact1', 'contact2', 'unions', 'submission_preference', 'represents',
        'does_not_represent', 'market', 'seeks', 'literary_only', 'bi_coastal',
        'freelance', 'talent', 'seeking', 'represents_min_age', 'represents_max_age',
        'seeking_min_age', 'seeking_max_age', 'archived'
      ]
    };

    const fields = entityFields[entity_type as keyof typeof entityFields];
    
    if (!fields) {
      return NextResponse.json(
        { error: 'Invalid entity type. Valid types are: Company, People, Address, Agency' },
        { status: 400 }
      );
    }

    return NextResponse.json({ entity_type, fields });
  } catch (error) {
    console.error('Error fetching entity fields:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entity fields' },
      { status: 500 }
    );
  }
}
