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

    // Check each company type table to determine ALL types this company has
    const types = [
      { table: 'agencies', type: 'Agency' },
      { table: 'casting', type: 'Casting' },
      { table: 'rental_spaces', type: 'Rental Space' },
      { table: 'theaters', type: 'Theater' },
      { table: 'rental_studios', type: 'Rental Studio' },
      { table: 'schools', type: 'School' }
    ];

    const companyTypes: string[] = [];
    const typeDataStatus: Record<string, boolean> = {};

    for (const { table, type } of types) {
      const result = await query(
        `SELECT COUNT(*) as count FROM ${table} WHERE company_no = $1 AND archived = false`,
        [companyId]
      );
      
      const hasData = parseInt(result.rows[0].count) > 0;
      if (hasData) {
        companyTypes.push(type);
        typeDataStatus[type] = true;
      }
    }

    return NextResponse.json({ 
      companyTypes,
      typeDataStatus,
      hasAnyData: companyTypes.length > 0
    });

  } catch (error) {
    console.error('Error detecting company types:', error);
    return NextResponse.json(
      { error: 'Failed to detect company types' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = parseInt(params.id);
    const body = await request.json();
    const { typeToAdd }: { typeToAdd: string } = body;
    
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

    if (!typeMapping[typeToAdd]) {
      return NextResponse.json(
        { error: 'Invalid company type' },
        { status: 400 }
      );
    }

    // Check if this type already exists for this company
    const mapping = typeMapping[typeToAdd];
    console.log(`Adding type ${typeToAdd} for company ${companyId}, mapping:`, mapping);
    
    const existingResult = await query(
      `SELECT COUNT(*) as count FROM ${mapping.table} WHERE company_no = $1 AND archived = false`,
      [companyId]
    );

    if (parseInt(existingResult.rows[0].count) > 0) {
      return NextResponse.json(
        { error: `Company already has ${typeToAdd} type` },
        { status: 400 }
      );
    }

    // Get next ID for the new record
    const maxResult = await query(
      `SELECT COALESCE(MAX(${mapping.idColumn}), 0) + 1 as next_id FROM ${mapping.table}`
    );
    const nextId = maxResult.rows[0].next_id;
    console.log(`Generated next ID for ${typeToAdd}:`, nextId);

    // Create minimal record based on type
    let insertQuery = '';
    let insertValues = [nextId, companyId];

    switch (typeToAdd) {
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

    console.log(`Executing query for ${typeToAdd}:`, insertQuery, insertValues);
    await query(insertQuery, insertValues);
    console.log(`Successfully added ${typeToAdd} type to company ${companyId}`);

    return NextResponse.json({ 
      success: true, 
      addedType: typeToAdd,
      message: `${typeToAdd} type added to company` 
    });

  } catch (error) {
    console.error('Error adding company type:', error);
    return NextResponse.json(
      { error: 'Failed to add company type' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const typeToRemove = searchParams.get('type');
    
    if (isNaN(companyId)) {
      return NextResponse.json(
        { error: 'Invalid company ID' },
        { status: 400 }
      );
    }

    if (!typeToRemove) {
      return NextResponse.json(
        { error: 'Type to remove not specified' },
        { status: 400 }
      );
    }

    // Map of type names to table names
    const typeMapping: Record<string, { table: string }> = {
      'Agency': { table: 'agencies' },
      'Casting': { table: 'casting' },
      'Rental Space': { table: 'rental_spaces' },
      'Theater': { table: 'theaters' },
      'Rental Studio': { table: 'rental_studios' },
      'School': { table: 'schools' }
    };

    if (!typeMapping[typeToRemove]) {
      return NextResponse.json(
        { error: 'Invalid company type' },
        { status: 400 }
      );
    }

    // Archive the type record
    const mapping = typeMapping[typeToRemove];
    await query(
      `UPDATE ${mapping.table} SET archived = true WHERE company_no = $1`,
      [companyId]
    );

    return NextResponse.json({ 
      success: true, 
      removedType: typeToRemove,
      message: `${typeToRemove} type removed from company` 
    });

  } catch (error) {
    console.error('Error removing company type:', error);
    return NextResponse.json(
      { error: 'Failed to remove company type' },
      { status: 500 }
    );
  }
}
