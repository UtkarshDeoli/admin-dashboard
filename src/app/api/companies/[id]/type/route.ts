import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = parseInt(params.id);
    
    if (isNaN(companyId)) {
      return NextResponse.json(
        { error: 'Invalid company ID' },
        { status: 400 }
      );
    }

    // Check each company type table to determine the type
    const types = [
      { table: 'agencies', type: 'Agency' },
      { table: 'casting', type: 'Casting' },
      { table: 'rental_spaces', type: 'Rental Space' },
      { table: 'theaters', type: 'Theater' },
      { table: 'rental_studios', type: 'Rental Studio' },
      { table: 'schools', type: 'School' }
    ];

    for (const { table, type } of types) {
      const result = await query(
        `SELECT COUNT(*) as count FROM ${table} WHERE company_no = $1 AND archived = false`,
        [companyId]
      );
      
      if (parseInt(result.rows[0].count) > 0) {
        return NextResponse.json({ 
          companyType: type,
          hasData: true 
        });
      }
    }

    // No type found
    return NextResponse.json({ 
      companyType: null,
      hasData: false 
    });

  } catch (error) {
    console.error('Error detecting company type:', error);
    return NextResponse.json(
      { error: 'Failed to detect company type' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = parseInt(params.id);
    const body = await request.json();
    const { newType, currentType }: { newType: string; currentType: string } = body;
    
    if (isNaN(companyId)) {
      return NextResponse.json(
        { error: 'Invalid company ID' },
        { status: 400 }
      );
    }

    // Map of type names to table names and ID columns
    const typeMapping: Record<string, { table: string; idColumn: string }> = {
      'Agency': { table: 'agencies', idColumn: 'agency_no' },
      'Casting': { table: 'casting', idColumn: 'casting_company_no' },
      'Rental Space': { table: 'rental_spaces', idColumn: 'space_no' },
      'Theater': { table: 'theaters', idColumn: 'theater_no' },
      'Rental Studio': { table: 'rental_studios', idColumn: 'studio_no' },
      'School': { table: 'schools', idColumn: 'school_no' }
    };

    // Archive old type records if currentType exists
    if (currentType && typeMapping[currentType]) {
      const currentMapping = typeMapping[currentType];
      await query(
        `UPDATE ${currentMapping.table} SET archived = true WHERE company_no = $1`,
        [companyId]
      );
    }

    // Create minimal record for new type if specified
    if (newType && typeMapping[newType]) {
      const newMapping = typeMapping[newType];
      
      // Get next ID for the new record
      const maxResult = await query(
        `SELECT COALESCE(MAX(${newMapping.idColumn}), 0) + 1 as next_id FROM ${newMapping.table}`
      );
      const nextId = maxResult.rows[0].next_id;

      // Create minimal record based on type
      let insertQuery = '';
      let insertValues = [nextId, companyId];

      switch (newType) {
        case 'Agency':
          insertQuery = `INSERT INTO agencies (
            agency_no, company_no, archived
          ) VALUES ($1, $2, false)`;
          break;
          
        case 'Casting':
          insertQuery = `INSERT INTO casting (
            casting_company_no, company_no, archived
          ) VALUES ($1, $2, false)`;
          break;
          
        case 'Rental Space':
          insertQuery = `INSERT INTO rental_spaces (
            space_no, company_no, archived
          ) VALUES ($1, $2, false)`;
          break;
          
        case 'Theater':
          insertQuery = `INSERT INTO theaters (
            theater_no, company_no, archived
          ) VALUES ($1, $2, false)`;
          break;
          
        case 'Rental Studio':
          insertQuery = `INSERT INTO rental_studios (
            studio_no, company_no, archived
          ) VALUES ($1, $2, false)`;
          break;
          
        case 'School':
          insertQuery = `INSERT INTO schools (
            school_no, company_no, policy, technique, audit, coaching, showcase,
            bi_coastal, online, in_person, class_size_min, class_size_max,
            age_min, age_max, archived
          ) VALUES ($1, $2, '', '', false, false, false, false, false, false, 0, 0, 0, 0, false)`;
          break;
          
        default:
          return NextResponse.json(
            { error: 'Invalid company type' },
            { status: 400 }
          );
      }

      await query(insertQuery, insertValues);
    }

    return NextResponse.json({ 
      success: true, 
      newType,
      message: `Company type changed to ${newType}` 
    });

  } catch (error) {
    console.error('Error changing company type:', error);
    return NextResponse.json(
      { error: 'Failed to change company type' },
      { status: 500 }
    );
  }
}
