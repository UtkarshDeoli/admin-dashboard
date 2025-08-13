import {
  agenciesAPI,
  castingAPI,
  rentalSpacesAPI,
  theatersAPI,
  rentalStudiosAPI,
  schoolsAPI,
} from './api';

export type CompanyType = 'Agency' | 'Casting' | 'RentalSpace' | 'Theater' | 'RentalStudio' | 'School';

export interface CompanyTypeResult {
  types: CompanyType[];
  primaryType: CompanyType | null;
  hasMultipleTypes: boolean;
  details: {
    agency?: any;
    casting?: any;
    rentalSpaces?: any;
    theater?: any;
    rentalStudios?: any;
    school?: any;
  };
}

/**
 * Determines the type(s) of a company by checking which related schemas contain the company_no
 * @param companyNo - The company number to check
 * @returns Promise<CompanyTypeResult> - Object containing the company types and related data
 */
export async function getCompanyType(companyNo: number): Promise<CompanyTypeResult> {
  const result: CompanyTypeResult = {
    types: [],
    primaryType: null,
    hasMultipleTypes: false,
    details: {},
  };

  try {
    // Check all company types in parallel
    const [
      agency,
      casting,
      rentalSpaces,
      theater,
      rentalStudios,
      school,
    ] = await Promise.allSettled([
      agenciesAPI.getByCompany(companyNo),
      castingAPI.getByCompany(companyNo),
      rentalSpacesAPI.getByCompany(companyNo),
      theatersAPI.getByCompany(companyNo),
      rentalStudiosAPI.getByCompany(companyNo),
      schoolsAPI.getByCompany(companyNo),
    ]);

    // Check Agency
    if (agency.status === 'fulfilled' && agency.value) {
      result.types.push('Agency');
      result.details.agency = agency.value;
    }

    // Check Casting
    if (casting.status === 'fulfilled' && casting.value) {
      result.types.push('Casting');
      result.details.casting = casting.value;
    }

    // Check Rental Spaces
    if (rentalSpaces.status === 'fulfilled' && rentalSpaces.value) {
      result.types.push('RentalSpace');
      result.details.rentalSpaces = rentalSpaces.value;
    }

    // Check Theater
    if (theater.status === 'fulfilled' && theater.value) {
      result.types.push('Theater');
      result.details.theater = theater.value;
    }

    // Check Rental Studios
    if (rentalStudios.status === 'fulfilled' && rentalStudios.value) {
      result.types.push('RentalStudio');
      result.details.rentalStudios = rentalStudios.value;
    }

    // Check School
    if (school.status === 'fulfilled' && school.value) {
      result.types.push('School');
      result.details.school = school.value;
    }

    // Determine primary type and if there are multiple types
    result.hasMultipleTypes = result.types.length > 1;
    result.primaryType = result.types.length > 0 ? result.types[0] : null;

    return result;
  } catch (error) {
    console.error('Error determining company type:', error);
    throw new Error('Failed to determine company type');
  }
}

/**
 * Get a human-readable string representation of company types
 * @param companyTypeResult - The result from getCompanyType
 * @returns string - Human-readable company type description
 */
export function formatCompanyTypes(companyTypeResult: CompanyTypeResult): string {
  if (companyTypeResult.types.length === 0) {
    return 'Unknown/Unspecified';
  }

  if (companyTypeResult.types.length === 1) {
    return companyTypeResult.types[0];
  }

  if (companyTypeResult.types.length === 2) {
    return `${companyTypeResult.types[0]} & ${companyTypeResult.types[1]}`;
  }

  const lastType = companyTypeResult.types.pop();
  return `${companyTypeResult.types.join(', ')} & ${lastType}`;
}

/**
 * Check if a company has a specific type
 * @param companyNo - The company number
 * @param type - The type to check for
 * @returns Promise<boolean> - Whether the company has this type
 */
export async function hasCompanyType(companyNo: number, type: CompanyType): Promise<boolean> {
  try {
    switch (type) {
      case 'Agency':
        const agency = await agenciesAPI.getByCompany(companyNo);
        return agency !== null;
      
      case 'Casting':
        const casting = await castingAPI.getByCompany(companyNo);
        return casting !== null;
      
      case 'RentalSpace':
        const rentalSpaces = await rentalSpacesAPI.getByCompany(companyNo);
        return rentalSpaces !== null;
      
      case 'Theater':
        const theater = await theatersAPI.getByCompany(companyNo);
        return theater !== null;
      
      case 'RentalStudio':
        const rentalStudios = await rentalStudiosAPI.getByCompany(companyNo);
        return rentalStudios !== null;

      case 'School':
        const school = await schoolsAPI.getByCompany(companyNo);
        return school !== null;
      
      default:
        return false;
    }
  } catch (error) {
    console.error(`Error checking company type ${type}:`, error);
    return false;
  }
}

/**
 * Get all companies of a specific type
 * @param type - The company type to filter by
 * @returns Promise<number[]> - Array of company numbers
 */
export async function getCompaniesByType(type: CompanyType): Promise<number[]> {
  try {
    let companyNos: number[] = [];

    switch (type) {
      case 'Agency':
        const agencies = await agenciesAPI.getAll();
        companyNos = agencies.map(a => a.company_no);
        break;
      
      case 'Casting':
        const castings = await castingAPI.getAll();
        companyNos = castings.map(c => c.company_no);
        break;
      
      case 'RentalSpace':
        const rentalSpaces = await rentalSpacesAPI.getAll();
        companyNos = [...new Set(rentalSpaces.map(rs => rs.company_no))];
        break;
      
      case 'Theater':
        const theaters = await theatersAPI.getAll();
        companyNos = theaters.map(t => t.company_no);
        break;
      
      case 'RentalStudio':
        const rentalStudios = await rentalStudiosAPI.getAll();
        companyNos = [...new Set(rentalStudios.map(rs => rs.company_no))];
        break;
      
      case 'School':
        const schools = await schoolsAPI.getAll();
        companyNos = schools.map(s => s.company_no);
        break;
    }

    return companyNos;
  } catch (error) {
    console.error(`Error getting companies by type ${type}:`, error);
    return [];
  }
}
