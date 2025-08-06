import { Company, Address, Person, Project, Comment, CompanyAddress, PrivacySetting, Agency, Casting, RentalSpace, Theater, RentalStudio, School } from '@/types/company';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

// Companies API
export const companiesAPI = {
  getAll: async (): Promise<Company[]> => {
    const response = await fetch(`${API_BASE_URL}/api/companies`);
    if (!response.ok) throw new Error('Failed to fetch companies');
    return response.json();
  },

  getById: async (id: number): Promise<Company> => {
    const response = await fetch(`${API_BASE_URL}/api/companies/${id}`);
    if (!response.ok) throw new Error('Failed to fetch company');
    return response.json();
  },

  getByType: async (companyType: string): Promise<Company[]> => {
    const response = await fetch(`${API_BASE_URL}/api/companies?type=${encodeURIComponent(companyType)}`);
    if (!response.ok) throw new Error('Failed to fetch companies by type');
    return response.json();
  },

  search: async (query: string, companyType?: string): Promise<Company[]> => {
    let url = `${API_BASE_URL}/api/companies/search?query=${encodeURIComponent(query)}`;
    if (companyType) {
      url += `&type=${encodeURIComponent(companyType)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to search companies');
    return response.json();
  },

  create: async (company: Omit<Company, 'company_no' | 'created_at' | 'updated_at'>): Promise<Company> => {
    const response = await fetch(`${API_BASE_URL}/api/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(company),
    });
    if (!response.ok) throw new Error('Failed to create company');
    return response.json();
  },

  update: async (id: number, company: Omit<Company, 'company_no' | 'created_at' | 'updated_at'>): Promise<Company> => {
    const response = await fetch(`${API_BASE_URL}/api/companies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(company),
    });
    if (!response.ok) throw new Error('Failed to update company');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/companies/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete company');
  },

  // Get company addresses
  getAddresses: async (companyId: number): Promise<Address[]> => {
    const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}/addresses`);
    if (!response.ok) throw new Error('Failed to fetch company addresses');
    return response.json();
  },

  // Add address to company
  addAddress: async (companyId: number, addressId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address_no: addressId }),
    });
    if (!response.ok) throw new Error('Failed to add address to company');
  },

  // Remove address from company
  removeAddress: async (companyId: number, addressId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}/addresses/${addressId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove address from company');
  },

  // Get company type
  getType: async (id: number): Promise<{ companyType: string | null; hasData: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/api/companies/${id}/type`);
    if (!response.ok) throw new Error('Failed to fetch company type');
    return response.json();
  },

  // Change company type
  changeType: async (id: number, newType: string, currentType?: string): Promise<{ success: boolean; newType: string; message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/companies/${id}/type`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newType, currentType }),
    });
    if (!response.ok) throw new Error('Failed to change company type');
    return response.json();
  },
};

// Addresses API
export const addressesAPI = {
  getAll: async (): Promise<Address[]> => {
    const response = await fetch(`${API_BASE_URL}/api/addresses`);
    if (!response.ok) throw new Error('Failed to fetch addresses');
    return response.json();
  },

  getById: async (id: number): Promise<Address> => {
    const response = await fetch(`${API_BASE_URL}/api/addresses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch address');
    return response.json();
  },

  create: async (address: Omit<Address, 'address_no'>): Promise<Address> => {
    const response = await fetch(`${API_BASE_URL}/api/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(address),
    });
    if (!response.ok) throw new Error('Failed to create address');
    return response.json();
  },

  update: async (id: number, address: Omit<Address, 'address_no'>): Promise<Address> => {
    const response = await fetch(`${API_BASE_URL}/api/addresses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(address),
    });
    if (!response.ok) throw new Error('Failed to update address');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/addresses/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete address');
  },
  search: async (query: string): Promise<Address[]> => {
    const response = await fetch(`${API_BASE_URL}/api/addresses/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search addresses');
    return response.json();
  },
};

// People API
export const peopleAPI = {
  getAll: async (): Promise<Person[]> => {
    const response = await fetch(`${API_BASE_URL}/api/people`);
    if (!response.ok) throw new Error('Failed to fetch people');
    return response.json();
  },

  getById: async (id: number): Promise<Person> => {
    const response = await fetch(`${API_BASE_URL}/api/people/${id}`);
    if (!response.ok) throw new Error('Failed to fetch person');
    return response.json();
  },

  create: async (person: Omit<Person, 'people_no'>): Promise<Person> => {
    const response = await fetch(`${API_BASE_URL}/api/people`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(person),
    });
    if (!response.ok) throw new Error('Failed to create person');
    return response.json();
  },

  update: async (id: number, person: Omit<Person, 'people_no'>): Promise<Person> => {
    const response = await fetch(`${API_BASE_URL}/api/people/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(person),
    });
    if (!response.ok) throw new Error('Failed to update person');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/people/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete person');
  },
  search: async (query: string): Promise<Person[]> => {
    const response = await fetch(`${API_BASE_URL}/api/people/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search people');
    return response.json();
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (): Promise<Project[]> => {
    const response = await fetch(`${API_BASE_URL}/api/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  getById: async (id: number): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`);
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  },

  create: async (project: Omit<Project, 'project_no'>): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  },

  update: async (id: number, project: Omit<Project, 'project_no'>): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete project');
  },
};

// Stats API
export const statsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  getCompanyCount: async () => {
    const response = await fetch(`${API_BASE_URL}/api/companies/count`);
    if (!response.ok) throw new Error('Failed to fetch company count');
    return response.json();
  },

  getAddressCount: async () => {
    const response = await fetch(`${API_BASE_URL}/api/addresses/count`);
    if (!response.ok) throw new Error('Failed to fetch address count');
    return response.json();
  },

  getPeopleCount: async () => {
    const response = await fetch(`${API_BASE_URL}/api/people/count`);
    if (!response.ok) throw new Error('Failed to fetch people count');
    return response.json();
  },

  getProjectCount: async () => {
    const response = await fetch(`${API_BASE_URL}/api/projects/count`);
    if (!response.ok) throw new Error('Failed to fetch project count');
    return response.json();
  },
};

// Agencies API
export const agenciesAPI = {
  getAll: async (): Promise<Agency[]> => {
    const response = await fetch(`${API_BASE_URL}/api/agencies`);
    if (!response.ok) throw new Error('Failed to fetch agencies');
    return response.json();
  },

  getById: async (id: number): Promise<Agency> => {
    const response = await fetch(`${API_BASE_URL}/api/agencies/${id}`);
    if (!response.ok) throw new Error('Failed to fetch agency');
    return response.json();
  },

  getByCompany: async (companyId: number): Promise<Agency | null> => {
    const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}/agency`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to fetch agency');
    return response.json();
  },

  create: async (agency: Omit<Agency, 'agency_no'>): Promise<Agency> => {
    const response = await fetch(`${API_BASE_URL}/api/agencies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agency),
    });
    if (!response.ok) throw new Error('Failed to create agency');
    return response.json();
  },

  update: async (id: number, agency: Omit<Agency, 'agency_no'>): Promise<Agency> => {
    const response = await fetch(`${API_BASE_URL}/api/agencies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agency),
    });
    if (!response.ok) throw new Error('Failed to update agency');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/agencies/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete agency');
  },
};

// Casting API
export const castingAPI = {
  getAll: async (): Promise<Casting[]> => {
    const response = await fetch(`${API_BASE_URL}/api/casting`);
    if (!response.ok) throw new Error('Failed to fetch casting companies');
    return response.json();
  },

  getById: async (id: number): Promise<Casting> => {
    const response = await fetch(`${API_BASE_URL}/api/casting/${id}`);
    if (!response.ok) throw new Error('Failed to fetch casting company');
    return response.json();
  },

  getByCompany: async (companyId: number): Promise<Casting | null> => {
    const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}/casting`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to fetch casting company');
    return response.json();
  },

  create: async (casting: Omit<Casting, 'casting_company_no'>): Promise<Casting> => {
    const response = await fetch(`${API_BASE_URL}/api/casting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(casting),
    });
    if (!response.ok) throw new Error('Failed to create casting company');
    return response.json();
  },

  update: async (id: number, casting: Omit<Casting, 'casting_company_no'>): Promise<Casting> => {
    const response = await fetch(`${API_BASE_URL}/api/casting/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(casting),
    });
    if (!response.ok) throw new Error('Failed to update casting company');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/casting/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete casting company');
  },
};

// Rental Spaces API
export const rentalSpacesAPI = {
  getAll: async (): Promise<RentalSpace[]> => {
    const response = await fetch(`${API_BASE_URL}/api/rental-spaces`);
    if (!response.ok) throw new Error('Failed to fetch rental spaces');
    return response.json();
  },

  getById: async (id: number): Promise<RentalSpace> => {
    const response = await fetch(`${API_BASE_URL}/api/rental-spaces/${id}`);
    if (!response.ok) throw new Error('Failed to fetch rental space');
    return response.json();
  },

  getByCompany: async (companyId: number): Promise<RentalSpace[]> => {
    const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}/rental-spaces`);
    if (!response.ok) throw new Error('Failed to fetch rental spaces');
    return response.json();
  },

  create: async (rentalSpace: Omit<RentalSpace, 'space_no'>): Promise<RentalSpace> => {
    const response = await fetch(`${API_BASE_URL}/api/rental-spaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rentalSpace),
    });
    if (!response.ok) throw new Error('Failed to create rental space');
    return response.json();
  },

  update: async (id: number, rentalSpace: Omit<RentalSpace, 'space_no'>): Promise<RentalSpace> => {
    const response = await fetch(`${API_BASE_URL}/api/rental-spaces/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rentalSpace),
    });
    if (!response.ok) throw new Error('Failed to update rental space');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/rental-spaces/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete rental space');
  },
};

// Theaters API
export const theatersAPI = {
  getAll: async (): Promise<Theater[]> => {
    const response = await fetch(`${API_BASE_URL}/api/theaters`);
    if (!response.ok) throw new Error('Failed to fetch theaters');
    return response.json();
  },

  getById: async (id: number): Promise<Theater> => {
    const response = await fetch(`${API_BASE_URL}/api/theaters/${id}`);
    if (!response.ok) throw new Error('Failed to fetch theater');
    return response.json();
  },

  getByCompany: async (companyId: number): Promise<Theater | null> => {
    const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}/theater`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to fetch theater');
    return response.json();
  },

  create: async (theater: Omit<Theater, 'theater_no'>): Promise<Theater> => {
    const response = await fetch(`${API_BASE_URL}/api/theaters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(theater),
    });
    if (!response.ok) throw new Error('Failed to create theater');
    return response.json();
  },

  update: async (id: number, theater: Omit<Theater, 'theater_no'>): Promise<Theater> => {
    const response = await fetch(`${API_BASE_URL}/api/theaters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(theater),
    });
    if (!response.ok) throw new Error('Failed to update theater');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/theaters/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete theater');
  },
};

// Rental Studios API
export const rentalStudiosAPI = {
  getAll: async (): Promise<RentalStudio[]> => {
    const response = await fetch(`${API_BASE_URL}/api/rental-studios`);
    if (!response.ok) throw new Error('Failed to fetch rental studios');
    return response.json();
  },

  getById: async (id: number): Promise<RentalStudio> => {
    const response = await fetch(`${API_BASE_URL}/api/rental-studios/${id}`);
    if (!response.ok) throw new Error('Failed to fetch rental studio');
    return response.json();
  },

  getByCompany: async (companyId: number): Promise<RentalStudio[]> => {
    const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}/rental-studios`);
    if (!response.ok) throw new Error('Failed to fetch rental studios');
    return response.json();
  },

  create: async (rentalStudio: Omit<RentalStudio, 'studio_no'>): Promise<RentalStudio> => {
    const response = await fetch(`${API_BASE_URL}/api/rental-studios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rentalStudio),
    });
    if (!response.ok) throw new Error('Failed to create rental studio');
    return response.json();
  },

  update: async (id: number, rentalStudio: Omit<RentalStudio, 'studio_no'>): Promise<RentalStudio> => {
    const response = await fetch(`${API_BASE_URL}/api/rental-studios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rentalStudio),
    });
    if (!response.ok) throw new Error('Failed to update rental studio');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/rental-studios/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete rental studio');
  },
};

// Schools API
export const schoolsAPI = {
  getAll: async (): Promise<School[]> => {
    const response = await fetch(`${API_BASE_URL}/api/schools`);
    if (!response.ok) throw new Error('Failed to fetch schools');
    return response.json();
  },

  getById: async (id: number): Promise<School> => {
    const response = await fetch(`${API_BASE_URL}/api/schools/${id}`);
    if (!response.ok) throw new Error('Failed to fetch school');
    return response.json();
  },

  getByCompany: async (companyId: number): Promise<School | null> => {
    const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}/school`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to fetch school');
    return response.json();
  },

  create: async (school: Omit<School, 'school_no'>): Promise<School> => {
    const response = await fetch(`${API_BASE_URL}/api/schools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(school),
    });
    if (!response.ok) throw new Error('Failed to create school');
    return response.json();
  },

  update: async (id: number, school: Omit<School, 'school_no'>): Promise<School> => {
    const response = await fetch(`${API_BASE_URL}/api/schools/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(school),
    });
    if (!response.ok) throw new Error('Failed to update school');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/schools/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete school');
  },
};
