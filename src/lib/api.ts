import { Company, Address, Person, Project, Comment, CompanyAddress, PrivacySetting } from '@/types/company';

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
