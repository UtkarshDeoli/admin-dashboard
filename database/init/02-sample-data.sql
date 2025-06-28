-- Sample data for testing
SET search_path TO core;

-- Insert sample companies
INSERT INTO companies (name, description, fka, acronym, verified) VALUES
('Google LLC', 'Technology company', 'Google Inc.', 'GOOGL', true),
('Apple Inc.', 'Consumer electronics company', NULL, 'AAPL', true),
('Microsoft Corporation', 'Software and cloud services', NULL, 'MSFT', true),
('Amazon.com Inc.', 'E-commerce and cloud computing', NULL, 'AMZN', true),
('Meta Platforms Inc.', 'Social media and virtual reality', 'Facebook Inc.', 'META', true);

-- Insert sample addresses
INSERT INTO addresses (line1, line2, city, state, zip, country, phone1, email1, website1, verified) VALUES
('1600 Amphitheatre Parkway', NULL, 'Mountain View', 'CA', '94043', 'USA', '+1-650-253-0000', 'contact@google.com', 'https://www.google.com', true),
('One Apple Park Way', NULL, 'Cupertino', 'CA', '95014', 'USA', '+1-408-996-1010', 'contact@apple.com', 'https://www.apple.com', true),
('One Microsoft Way', NULL, 'Redmond', 'WA', '98052', 'USA', '+1-425-882-8080', 'contact@microsoft.com', 'https://www.microsoft.com', true),
('410 Terry Ave N', NULL, 'Seattle', 'WA', '98109', 'USA', '+1-206-266-1000', 'contact@amazon.com', 'https://www.amazon.com', true),
('1 Hacker Way', NULL, 'Menlo Park', 'CA', '94025', 'USA', '+1-650-543-4800', 'contact@meta.com', 'https://www.meta.com', true);

-- Insert sample people
INSERT INTO people (first_name, middle_name, last_name, address_no, no_book, archived) VALUES
('John', 'A', 'Doe', 1, false, false),
('Jane', 'B', 'Smith', 2, false, false),
('Michael', 'C', 'Johnson', 3, false, false),
('Sarah', 'D', 'Williams', 4, false, false),
('David', 'E', 'Brown', 5, false, false),
('Emily', 'F', 'Davis', 1, false, false),
('Robert', 'G', 'Miller', 2, false, false),
('Lisa', 'H', 'Wilson', 3, false, false);

-- Insert sample projects
INSERT INTO projects (name, aka, type, genre, casting_status, union, start_date, end_date, description, musical, publish, archived, city1, state1, country1) VALUES
('Project Alpha', 'Alpha Initiative', 'Film', 'Drama', 'Open', 'SAG-AFTRA', '2024-01-15', '2024-06-30', 'A dramatic film about technology and humanity', false, true, false, 'Los Angeles', 'CA', 'USA'),
('Beta Productions', 'Beta Project', 'Television', 'Comedy', 'Closed', 'SAG-AFTRA', '2024-02-01', '2024-08-15', 'Comedy series about startup life', false, true, false, 'New York', 'NY', 'USA'),
('Gamma Musical', NULL, 'Theater', 'Musical', 'Auditions', 'Equity', '2024-03-01', '2024-12-31', 'Broadway musical production', true, false, false, 'New York', 'NY', 'USA'),
('Delta Documentary', 'Delta Docs', 'Documentary', 'Documentary', 'Pre-production', 'DGA', '2024-04-01', '2024-10-31', 'Documentary about climate change', false, false, false, 'San Francisco', 'CA', 'USA');

-- Insert sample company-address relationships
INSERT INTO company_addresses (company_no, address_no, archived, locaction) VALUES
(1, 1, false, 'Headquarters'),
(2, 2, false, 'Main Campus'),
(3, 3, false, 'Corporate HQ'),
(4, 4, false, 'Global HQ'),
(5, 5, false, 'Meta HQ');

-- Insert sample comments
INSERT INTO comments (entity_type, entity_no, admin_no, comment) VALUES
('company', 1, 1, 'Verified company information updated'),
('company', 2, 1, 'Address verification completed'),
('person', 1, 1, 'Contact information updated'),
('project', 1, 1, 'Casting call scheduled for next week'),
('project', 2, 1, 'Production timeline adjusted');

-- Insert sample privacy settings
INSERT INTO privacy_settings (entity_no, entity_type, field_name, is_private) VALUES
(1, 'person', 'phone1', true),
(1, 'person', 'email1', false),
(2, 'person', 'phone1', true),
(3, 'person', 'email1', true),
(1, 'company', 'phone1', false),
(2, 'company', 'email1', false);
