# Admin Dashboard - PostgreSQL Database Setup

This guide explains how to set up a local PostgreSQL database using Docker for the Admin Dashboard application.

## 🗄️ Database Schema Overview

The database contains the following main entities:

- **Companies**: Business entities with verification status
- **Addresses**: Physical/contact addresses
- **People**: Individual persons linked to addresses
- **Projects**: Film, TV, theater productions with casting info
- **Comments**: Comments on any entity
- **Company_Addresses**: Many-to-many relationship between companies and addresses
- **Privacy_Settings**: Field-level privacy controls

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- macOS, Linux, or Windows with WSL2

### 1. Start the Database

Run the automated setup script:

```bash
./setup-database.sh
```

Or manually with Docker Compose:

```bash
docker-compose up -d
```

### 2. Verify Setup

Check that containers are running:

```bash
docker-compose ps
```

You should see:
- `admin-dashboard-postgres` (PostgreSQL database)
- `admin-dashboard-pgadmin` (Database management UI)

### 3. Configure Your Application

Update your `.env.local` file to use the local database:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=utda
DB_USER=utda_dbun
DB_PASSWORD=XBBtp7ltj3#5rH?i
NODE_ENV=development
```

## 🔧 Database Management

### PgAdmin Web Interface

Access the database management interface:

1. Open http://localhost:8080
2. Login with:
   - **Email**: admin@admin.com
   - **Password**: admin
3. Add a new server:
   - **Name**: Admin Dashboard Local
   - **Host**: postgres
   - **Port**: 5432
   - **Database**: utda
   - **Username**: utda_dbun
   - **Password**: XBBtp7ltj3#5rH?i

### Direct Database Connection

Connect directly using psql:

```bash
docker exec -it admin-dashboard-postgres psql -U utda_dbun -d utda
```

### Database Schema Commands

```sql
-- Set the schema
SET search_path TO core;

-- List all tables
\dt

-- View table structure
\d companies
\d addresses
\d people
\d projects
```

## 📊 Sample Data

The database is initialized with sample data including:

- 5 sample companies (Google, Apple, Microsoft, Amazon, Meta)
- 5 corresponding addresses
- 8 sample people
- 4 sample projects
- Associated comments and privacy settings

## 🛠️ Development Commands

### Container Management

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v

# View logs
docker-compose logs postgres
docker-compose logs pgadmin

# Follow logs in real-time
docker-compose logs -f postgres
```

### Database Operations

```bash
# Backup database
docker exec admin-dashboard-postgres pg_dump -U utda_dbun utda > backup.sql

# Restore database
docker exec -i admin-dashboard-postgres psql -U utda_dbun utda < backup.sql

# Reset database with fresh schema
docker-compose down -v
docker-compose up -d
```

## 🔄 Switching Between Local and Cloud Database

The application is configured to automatically detect and use the appropriate database:

### For Local Development:
```env
NODE_ENV=development
DB_HOST=localhost
```

### For Cloud/Production:
```env
NODE_ENV=production
DB_HOST=35.232.27.6
```

The `src/lib/db-local.ts` file handles this switching automatically.

## 📁 File Structure

```
database/
├── init/
│   ├── 01-schema.sql      # Database schema and tables
│   └── 02-sample-data.sql # Sample data for testing
docker-compose.yml         # Docker services configuration
setup-database.sh         # Automated setup script
.env.local                # Local environment variables
```

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check if port 5432 is already in use
lsof -i :5432

# If PostgreSQL is running locally, stop it
brew services stop postgresql
# or
sudo service postgresql stop
```

### Database Connection Issues

1. Ensure containers are running: `docker-compose ps`
2. Check logs: `docker-compose logs postgres`
3. Verify environment variables in `.env.local`
4. Restart containers: `docker-compose restart`

### Reset Everything

```bash
# Complete reset
docker-compose down -v
docker system prune -f
./setup-database.sh
```

### Permission Issues

```bash
# Fix script permissions
chmod +x setup-database.sh

# Fix Docker permissions (Linux)
sudo usermod -aG docker $USER
```

## 🔒 Security Notes

- The database runs on localhost only
- Default credentials are for development only
- For production, use environment variables and secrets
- Consider using Docker secrets for sensitive data

## 📝 API Integration

Your Next.js API routes in `src/app/api/` will automatically connect to the local database when:

1. `.env.local` contains `DB_HOST=localhost`
2. The Docker containers are running
3. Your app is restarted to pick up the new environment variables

## 🔗 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [PgAdmin Documentation](https://www.pgadmin.org/docs/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
