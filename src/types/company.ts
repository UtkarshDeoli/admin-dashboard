export interface Company {
  company_no: number;
  name: string;
  description: string;
  fka: string; // formerly known as
  acronym: string;
  verified: boolean;
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
}

export interface Person {
  people_no: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  address_no: number;
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
  comment_no: number;
  entity_type: string;
  entity_no: number;
  admin_no: number;
  date: string;
  comment: string;
}

export interface CompanyAddress {
  id: number;
  company_no: number;
  address_no: number;
  archived: boolean;
  locaction: string; // Note: keeping the typo from schema
}

export interface PrivacySetting {
  id: number;
  entity_no: number;
  entity_type: string;
  field_name: string;
  is_private: boolean;
}
