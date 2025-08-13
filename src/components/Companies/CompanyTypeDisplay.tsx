import React, { useState, useEffect } from 'react';
import { getCompanyType, formatCompanyTypes, CompanyTypeResult } from '@/lib/company-utils';
import { Company } from '@/types/company';

interface CompanyTypeDisplayProps {
  company: Company;
  showDetails?: boolean;
}

const CompanyTypeDisplay: React.FC<CompanyTypeDisplayProps> = ({ 
  company, 
  showDetails = false 
}) => {
  const [companyTypeResult, setCompanyTypeResult] = useState<CompanyTypeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyType = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getCompanyType(company.company_no);
        console.log('Company Type Result:', result);
        setCompanyTypeResult(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch company type');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyType();
  }, [company.company_no]);

  if (loading) {
    return (
      <div className="flex items-center space-x-1">
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
        <span className="text-xs text-gray-500 dark:text-gray-400">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-xs">
        Error
      </div>
    );
  }

  if (!companyTypeResult) {
    return (
      <span className="text-gray-500 dark:text-gray-400 text-xs">Unknown</span>
    );
  }

  const typeString = formatCompanyTypes(companyTypeResult);
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Agency': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Casting': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'RentalSpace': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Theater': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'RentalStudio': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'School': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-1">
      {/* Type badges */}
      <div className="flex flex-wrap gap-1">
        {companyTypeResult.types.length > 0 ? (
          companyTypeResult.types.slice(0, 2).map((type) => (
            <span
              key={type}
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(type)}`}
            >
              {type}
            </span>
          ))
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Unspecified
          </span>
        )}
        
        {companyTypeResult.types.length > 2 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300">
            +{companyTypeResult.types.length - 2}
          </span>
        )}
        
        {companyTypeResult.hasMultipleTypes && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            Multi
          </span>
        )}
      </div>

      {/* Details section */}
      {showDetails && companyTypeResult.types.length > 0 && (
        <div className="mt-3 text-sm">
          <h4 className="font-medium text-gray-900 mb-2">Type Details:</h4>
          
          {companyTypeResult.details.agency && (
            <div className="mb-2">
              <strong>Agency:</strong> 
              <span className="ml-2 text-gray-600">
                Represents: {companyTypeResult.details.agency.represents || 'N/A'}
              </span>
            </div>
          )}
          
          {companyTypeResult.details.casting && (
            <div className="mb-2">
              <strong>Casting:</strong>
              <span className="ml-2 text-gray-600">
                Casts for: {companyTypeResult.details.casting.casts_for || 'N/A'}
              </span>
            </div>
          )}
          
          {companyTypeResult.details.theater && (
            <div className="mb-2">
              <strong>Theater:</strong>
              <span className="ml-2 text-gray-600">
                {companyTypeResult.details.theater.musical ? 'Musical' : 'Non-Musical'} Theater
              </span>
            </div>
          )}
          
          {companyTypeResult.details.school && (
            <div className="mb-2">
              <strong>School:</strong>
              <span className="ml-2 text-gray-600">
                Technique: {companyTypeResult.details.school.technique || 'N/A'}
              </span>
            </div>
          )}
          
          {companyTypeResult.details.rentalSpaces && companyTypeResult.details.rentalSpaces.length > 0 && (
            <div className="mb-2">
              <strong>Rental Spaces:</strong>
              <span className="ml-2 text-gray-600">
                {companyTypeResult.details.rentalSpaces.length} space(s) available
              </span>
            </div>
          )}
          
          {companyTypeResult.details.rentalStudios && companyTypeResult.details.rentalStudios.length > 0 && (
            <div className="mb-2">
              <strong>Rental Studios:</strong>
              <span className="ml-2 text-gray-600">
                {companyTypeResult.details.rentalStudios.length} studio(s) available
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyTypeDisplay;
