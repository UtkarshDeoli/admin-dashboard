import { PrivacySetting } from '@/types/company';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface PrivacySettingsFilters {
  entity_type?: string;
  entity_no?: number;
  field_name?: string;
  online_private?: boolean;
  publication_private?: boolean;
}

export interface PrivacySettingsStats {
  overview: {
    total: number;
    online_private: number;
    publication_private: number;
    fully_private: number;
    fully_public: number;
  };
  by_entity_type: Array<{
    entity_type: string;
    total: number;
    online_private: number;
    publication_private: number;
    fully_private: number;
    fully_public: number;
  }>;
  by_field: Array<{
    field_name: string;
    total: number;
    online_private: number;
    publication_private: number;
    fully_private: number;
  }>;
  patterns: Array<{
    is_private_online: boolean;
    is_private_publication: boolean;
    count: number;
    percentage: number;
  }>;
}

export interface BulkUpdateRequest {
  ids: number[];
  updates: Partial<Pick<PrivacySetting, 'is_private_online' | 'is_private_publication'>>;
}

export interface BulkDeleteRequest {
  ids: number[];
}

class PrivacySettingsAPI {
  private baseUrl = `${API_BASE_URL}/api/privacy-settings`;

  async getAll(filters?: PrivacySettingsFilters): Promise<PrivacySetting[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const url = params.toString() ? `${this.baseUrl}?${params}` : this.baseUrl;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch privacy settings: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getById(id: number): Promise<PrivacySetting> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch privacy setting: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getByEntity(entity_type: string, entity_no: number): Promise<PrivacySetting[]> {
    const params = new URLSearchParams({
      entity_type,
      entity_no: String(entity_no)
    });
    
    const response = await fetch(`${this.baseUrl}/entity?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch privacy settings by entity: ${response.statusText}`);
    }
    
    return response.json();
  }

  async create(privacySetting: Omit<PrivacySetting, 'id'>): Promise<PrivacySetting> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(privacySetting),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to create privacy setting: ${response.statusText}`);
    }
    
    return response.json();
  }

  async update(id: number, privacySetting: Omit<PrivacySetting, 'id'>): Promise<PrivacySetting> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(privacySetting),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to update privacy setting: ${response.statusText}`);
    }
    
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to delete privacy setting: ${response.statusText}`);
    }
  }

  async bulkUpdate(request: BulkUpdateRequest): Promise<{ message: string; updated: PrivacySetting[] }> {
    const response = await fetch(`${this.baseUrl}/bulk`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to bulk update privacy settings: ${response.statusText}`);
    }
    
    return response.json();
  }

  async bulkDelete(request: BulkDeleteRequest): Promise<{ message: string; deleted: PrivacySetting[] }> {
    const response = await fetch(`${this.baseUrl}/bulk`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to bulk delete privacy settings: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getStats(): Promise<PrivacySettingsStats> {
    const response = await fetch(`${this.baseUrl}/stats`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch privacy settings statistics: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getFieldsForEntityType(entity_type?: string): Promise<Record<string, string[]> | { entity_type: string; fields: string[] }> {
    const url = entity_type ? `${this.baseUrl}/fields?entity_type=${entity_type}` : `${this.baseUrl}/fields`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch entity fields: ${response.statusText}`);
    }
    
    return response.json();
  }
}

export const privacySettingsAPI = new PrivacySettingsAPI();
