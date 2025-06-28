#!/bin/bash

# Admin Dashboard - Docker PostgreSQL Setup Script
# This script sets up a local PostgreSQL database using Docker

set -e

echo "🚀 Starting Admin Dashboard PostgreSQL Setup..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Stop and remove existing containers if they exist
echo "🧹 Cleaning up existing containers..."
docker-compose down -v 2>/dev/null || true

# Build and start the containers
echo "🐳 Starting PostgreSQL and PgAdmin containers..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Check if PostgreSQL is ready
until docker exec admin-dashboard-postgres pg_isready -U utda_dbun -d utda; do
    echo "⏳ Waiting for PostgreSQL..."
    sleep 2
done

echo "✅ PostgreSQL is ready!"

# Display connection information
echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📊 Database Information:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: utda"
echo "  Username: utda_dbun"
echo "  Password: XBBtp7ltj3#5rH?i"
echo ""
echo "🔧 PgAdmin (Database Management):"
echo "  URL: http://localhost:8080"
echo "  Email: admin@admin.com"
echo "  Password: admin"
echo ""
echo "📝 To connect to the database in PgAdmin:"
echo "  1. Open http://localhost:8080"
echo "  2. Login with the credentials above"
echo "  3. Add a new server with these settings:"
echo "     - Name: Admin Dashboard Local"
echo "     - Host: postgres (container name)"
echo "     - Port: 5432"
echo "     - Database: utda"
echo "     - Username: utda_dbun"
echo "     - Password: XBBtp7ltj3#5rH?i"
echo ""
echo "🛠️  To use the local database in your app:"
echo "  1. Update your .env.local file with DB_HOST=localhost"
echo "  2. Restart your Next.js development server"
echo ""
echo "🔄 Useful commands:"
echo "  Stop containers: docker-compose down"
echo "  Start containers: docker-compose up -d"
echo "  View logs: docker-compose logs"
echo "  Reset database: docker-compose down -v && docker-compose up -d"
