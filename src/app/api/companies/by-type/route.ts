import { NextRequest, NextResponse } from 'next/server';
import { getCompaniesByTypeDB } from '@/lib/server-utils';
import { CompanyType } from '@/types/company';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type');
    
    if (!type || type === 'All' || type === '') {
      return NextResponse.json(
        { error: 'Valid company type is required' },
        { status: 400 }
      );
    }

    // Validate the type
    const validTypes: CompanyType[] = ['Agency', 'Casting', 'RentalSpace', 'Theater', 'RentalStudio', 'School'];
    if (!validTypes.includes(type as CompanyType)) {
      return NextResponse.json(
        { error: 'Invalid company type' },
        { status: 400 }
      );
    }

    const companyNos = await getCompaniesByTypeDB(type as CompanyType);
    return NextResponse.json({ companyNos, count: companyNos.length });
  } catch (error) {
    console.error('Error getting companies by type:', error);
    return NextResponse.json(
      { error: 'Failed to get companies by type' },
      { status: 500 }
    );
  }
}
