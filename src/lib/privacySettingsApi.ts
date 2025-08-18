import { PrivacySetting } from '@/types/company';

const API_BASE = '/api/privacy-settings';

export interface PrivacySettingsFilters {
  entity_type?: string;
  entity_no?: number;
  field_name?: string;
  online_private?: boolean;
  publication_private?: boolean;
}

export interface BulkUpdateData {
  ids: number[];
  is_private_online?: boolean;
  is_private_publication?: boolean;
}

export interface CreatePrivacySettingData {
  entity_no: number;
  entity_type: string;
  field_name: string;
  is_private_online?: boolean;
  is_private_publication?: boolean;
}

export const privacySettingsApi = {
  // Get all privacy settings with optional filters
  async getAll(filters?: PrivacySettingsFilters): Promise<PrivacySetting[]> {
    const params = new URLSearchParams();
    
    if (filters?.entity_type) params.append('entity_type', filters.entity_type);
    if (filters?.entity_no) params.append('entity_no', filters.entity_no.toString());
    if (filters?.field_name) params.append('field_name', filters.field_name);
    if (filters?.online_private !== undefined) params.append('online_private', filters.online_private.toString());
    if (filters?.publication_private !== undefined) params.append('publication_private', filters.publication_private.toString());
    
    const url = params.toString() ? `${API_BASE}?${params.toString()}` : API_BASE;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch privacy settings');
    }
    
    return response.json();
  },

  // Get a specific privacy setting by ID
  async getById(id: number): Promise<PrivacySetting> {
    const response = await fetch(`${API_BASE}/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch privacy setting');
    }
    
    return response.json();
  },

  // Create a new privacy setting
  async create(data: CreatePrivacySettingData): Promise<PrivacySetting> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create privacy setting');
    }
    
    return response.json();
  },

  // Update a privacy setting
  async update(id: number, data: Partial<PrivacySetting>): Promise<PrivacySetting> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update privacy setting');
    }
    
    return response.json();
  },

  // Delete a privacy setting
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete privacy setting');
    }
  },

  // Bulk update privacy settings
  async bulkUpdate(data: BulkUpdateData): Promise<PrivacySetting[]> {
    const response = await fetch(`${API_BASE}/bulk`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to bulk update privacy settings');
    }
    
    return response.json();
  },

  // Bulk delete privacy settings
  async bulkDelete(ids: number[]): Promise<void> {
    const response = await fetch(`${API_BASE}/bulk`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to bulk delete privacy settings');
    }
  },

  // Get privacy settings by entity
  async getByEntity(entityType: string, entityNo: number): Promise<PrivacySetting[]> {
    return this.getAll({ entity_type: entityType, entity_no: entityNo });
  },

  // Get statistics
  async getStatistics(): Promise<{
    total: number;
    online_private: number;
    publication_private: number;
    fully_private: number;
    fully_public: number;
    by_entity_type: Record<string, {
      total: number;
      online_private: number;
      publication_private: number;
      fully_private: number;
    }>;
  }> {
    const response = await fetch(`${API_BASE}/statistics`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch privacy settings statistics');
    }
    
    return response.json();
  },

  // Get available fields for entity type
  async getAvailableFields(entityType: string): Promise<string[]> {
    const response = await fetch(`${API_BASE}/fields?entity_type=${entityType}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch available fields');
    }
    
    const data = await response.json();
    return data.fields;
  }
};
