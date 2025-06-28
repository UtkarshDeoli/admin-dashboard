-- Create core schema
CREATE SCHEMA IF NOT EXISTS core;

-- Set default search path
SET search_path TO core;

-- Create Companies table
CREATE TABLE companies (
    company_no SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    fka VARCHAR(255), -- formerly known as
    acronym VARCHAR(50),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Addresses table
CREATE TABLE addresses (
    address_no SERIAL PRIMARY KEY,
    line1 VARCHAR(255),
    line2 VARCHAR(255),
    line3 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip VARCHAR(20),
    country VARCHAR(100),
    phone1 VARCHAR(50),
    phone2 VARCHAR(50),
    phone3 VARCHAR(50),
    email1 VARCHAR(255),
    email2 VARCHAR(255),
    website1 VARCHAR(255),
    website2 VARCHAR(255),
    fax VARCHAR(50),
    verified BOOLEAN DEFAULT FALSE
);

-- Create People table
CREATE TABLE people (
    people_no SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    address_no INTEGER REFERENCES addresses(address_no),
    no_book BOOLEAN DEFAULT FALSE,
    archived BOOLEAN DEFAULT FALSE
);

-- Create Projects table
CREATE TABLE projects (
    project_no SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    aka VARCHAR(255), -- also known as
    fka VARCHAR(255), -- formerly known as
    type VARCHAR(100),
    genre VARCHAR(100),
    casting_status VARCHAR(100),
    union VARCHAR(100),
    start_date DATE,
    end_date DATE,
    description TEXT,
    musical BOOLEAN DEFAULT FALSE,
    publish BOOLEAN DEFAULT FALSE,
    archived BOOLEAN DEFAULT FALSE,
    city1 VARCHAR(100),
    state1 VARCHAR(100),
    country1 VARCHAR(100),
    city2 VARCHAR(100),
    state2 VARCHAR(100),
    country2 VARCHAR(100)
);

-- Create Comments table
CREATE TABLE comments (
    comment_no SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- 'company', 'person', 'project', etc.
    entity_no INTEGER NOT NULL,
    admin_no INTEGER, -- reference to admin/user who made the comment
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment TEXT
);

-- Create Company_Addresses junction table
CREATE TABLE company_addresses (
    id SERIAL PRIMARY KEY,
    company_no INTEGER REFERENCES companies(company_no) ON DELETE CASCADE,
    address_no INTEGER REFERENCES addresses(address_no) ON DELETE CASCADE,
    archived BOOLEAN DEFAULT FALSE,
    locaction VARCHAR(255) -- Note: keeping the typo as per your schema
);

-- Create Privacy Settings table
CREATE TABLE privacy_settings (
    id SERIAL PRIMARY KEY,
    entity_no INTEGER NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'company', 'person', 'project', etc.
    field_name VARCHAR(100) NOT NULL,
    is_private BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_verified ON companies(verified);
CREATE INDEX idx_addresses_city ON addresses(city);
CREATE INDEX idx_addresses_state ON addresses(state);
CREATE INDEX idx_addresses_country ON addresses(country);
CREATE INDEX idx_people_last_name ON people(last_name);
CREATE INDEX idx_people_first_name ON people(first_name);
CREATE INDEX idx_people_address_no ON people(address_no);
CREATE INDEX idx_projects_name ON projects(name);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_archived ON projects(archived);
CREATE INDEX idx_comments_entity ON comments(entity_type, entity_no);
CREATE INDEX idx_comments_date ON comments(date);
CREATE INDEX idx_company_addresses_company ON company_addresses(company_no);
CREATE INDEX idx_company_addresses_address ON company_addresses(address_no);
CREATE INDEX idx_privacy_settings_entity ON privacy_settings(entity_type, entity_no);

-- Add foreign key constraints
ALTER TABLE company_addresses 
ADD CONSTRAINT fk_company_addresses_company 
FOREIGN KEY (company_no) REFERENCES companies(company_no);

ALTER TABLE company_addresses 
ADD CONSTRAINT fk_company_addresses_address 
FOREIGN KEY (address_no) REFERENCES addresses(address_no);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on companies
CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON companies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
