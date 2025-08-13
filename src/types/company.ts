export interface Company {
  company_no: number;
  name: string;
  description: string;
  fka: string; // formerly known as
  acronym: string;
  verified: boolean;
  archived: boolean;
}

export type CompanyType = 'Agency' | 'Casting' | 'RentalSpace' | 'Theater' | 'RentalStudio' | 'School';

export interface CompanyWithType extends Company {
  companyTypes: CompanyType[];
  primaryType: CompanyType | null;
  hasMultipleTypes: boolean;
}

export interface Agency {
  agency_no: number;
  company_no: number;
  address_no: number;
  contact1: string;
  contact2: string;
  unions: string;
  submission_preference: string;
  represents: string;
  does_not_represent: string;
  market: string;
  seeks: string;
  literary_only: boolean;
  bi_coastal: boolean;
  freelance: boolean;
  talent: boolean;
  seeking: boolean;
  represents_min_agee: number;
  represents_max_age: number;
  seeking_min_age: number;
  seeking_max_age: number;
  archived: boolean;
}

export interface Casting {
  casting_company_no: number;
  company_no: number;
  address_no: number;
  contact1: string;
  contact2: string;
  submission_preference: string;
  casts_for: string;
  seeking: string;
  market: string;
  unions: string;
  talk_variey: boolean;
  bi_coastal: boolean;
  primetime: boolean;
  archived: boolean;
}

export interface RentalSpace {
  space_no: number;
  company_no: number;
  address_no: number;
  name: string;
  dimensions: string;
  seats: number;
  space_type: string;
  archived: boolean;
}

export interface Theater {
  theater_no: number;
  company_no: number;
  submission_preference: string;
  literary_submission_preference: string;
  contract: string;
  production_compnay: boolean;
  summer: boolean;
  musical: boolean;
  community: boolean;
  outdoor: boolean;
  archived: boolean;
}

export interface RentalStudio {
  studio_no: number;
  company_no: number;
  address_no: number;
  name: string;
  num_studios: number;
  rate: number;
  rate_frequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly';
  archived: boolean;
}

export interface School {
  school_no: number;
  company_no: number;
  policy: string;
  technique: string;
  audit: boolean;
  coaching: boolean;
  showcase: boolean;
  bi_coastal: boolean;
  online: boolean;
  in_person: boolean;
  class_size_min: number;
  class_size_max: number;
  age_min: number;
  age_max: number;
  archived: boolean;
}

export interface Address {
  address_no: number;
  line1: string;
  line2: string;
  line3: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone1: string;
  phone2: string;
  phone3: string;
  email1: string;
  email2: string;
  website1: string;
  website2: string;
  fax: string;
  verified: boolean;
  // Fields for company-address relationship
  relationship_archived?: boolean;
  locaction?: string;
}

export interface Person {
  people_no: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  no_book: boolean;
  archived: boolean;
}

export interface Project {
  project_no: number;
  name: string;
  aka: string;
  fka: string;
  type: string;
  genre: string;
  casting_status: string;
  union: string;
  start_date: string;
  end_date: string;
  description: string;
  musical: boolean;
  publish: boolean;
  archived: boolean;
  city1: string;
  state1: string;
  country1: string;
  city2: string;
  state2: string;
  country2: string;
}

export interface Comment {
  id: number;
  entity_no: number;
  admin_no: number;
  date: string;
  comment: string;
  entity_type: string;
}

export interface CompanyAddress {
  id: number;
  company_no: number;
  address_no: number;
  archived: boolean;
  locaction: string; // Note: keeping the typo from schema
}

export interface PeopleAddress {
  id: number;
  people_no: number;
  address_no: number;
  archived: boolean;
}

export interface PrivacySetting {
  id: number;
  entity_no: number;
  entity_type: string;
  field_name: string;
  is_private: boolean;
}
