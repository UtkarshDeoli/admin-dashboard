import { query } from './db';
import { CompanyType } from '@/types/company';

/**
 * Server-only utility to get companies by type using direct database queries
 * This avoids the issue with API routes calling other API routes in serverless environments
 * @param type - The company type to filter by
 * @returns Promise<number[]> - Array of company numbers
 */
export async function getCompaniesByTypeDB(type: CompanyType): Promise<number[]> {
  try {
    let companyNos: number[] = [];

    switch (type) {
      case 'Agency':
        const agencyResult = await query('SELECT DISTINCT company_no FROM agencies WHERE archived = false');
        companyNos = agencyResult.rows.map(row => row.company_no);
        break;
      
      case 'Casting':
        const castingResult = await query('SELECT DISTINCT company_no FROM casting WHERE archived = false');
        companyNos = castingResult.rows.map(row => row.company_no);
        break;
      
      case 'RentalSpace':
        const rentalSpaceResult = await query('SELECT DISTINCT company_no FROM rental_spaces WHERE archived = false');
        companyNos = rentalSpaceResult.rows.map(row => row.company_no);
        break;
      
      case 'Theater':
        const theaterResult = await query('SELECT DISTINCT company_no FROM theaters WHERE archived = false');
        companyNos = theaterResult.rows.map(row => row.company_no);
        break;
      
      case 'RentalStudio':
        const rentalStudioResult = await query('SELECT DISTINCT company_no FROM rental_studios WHERE archived = false');
        companyNos = rentalStudioResult.rows.map(row => row.company_no);
        break;
      
      case 'School':
        const schoolResult = await query('SELECT DISTINCT company_no FROM schools WHERE archived = false');
        companyNos = schoolResult.rows.map(row => row.company_no);
        break;
    }

    return companyNos;
  } catch (error) {
    console.error(`Error getting companies by type ${type}:`, error);
    return [];
  }
}
