#!/bin/bash

# Wave Development Setup Script
# This script sets up the entire Wave development environment for new developers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# Banner
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌊 Wave Development Environment Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_success "Docker and Docker Compose are installed"

# Set default environment variables (docker compose will use these or its own defaults)
export APP_NAME="Wave"
export APP_ENV="local"
export APP_DEBUG="true"
export APP_PORT="8080"
export DB_DATABASE="wave"
export DB_USERNAME="wave"
export DB_PASSWORD="secret"
export DB_ROOT_PASSWORD="root"
export PHPMYADMIN_PORT="8081"
export MAILPIT_WEB_PORT="8025"
export MAILPIT_SMTP_PORT="1025"
export WAVE_REPO="https://github.com/thedevdojo/wave.git"
export WAVE_VERSION="3.1.2"

# Allow customization via command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --db-name)
            if [ -z "$2" ] || [[ "$2" == --* ]]; then
                print_error "--db-name requires a value"
                exit 1
            fi
            export DB_DATABASE="$2"
            print_info "Database name set to: $DB_DATABASE"
            shift 2
            ;;
        --db-user)
            if [ -z "$2" ] || [[ "$2" == --* ]]; then
                print_error "--db-user requires a value"
                exit 1
            fi
            export DB_USERNAME="$2"
            print_info "Database user set to: $DB_USERNAME"
            shift 2
            ;;
        --db-password)
            if [ -z "$2" ] || [[ "$2" == --* ]]; then
                print_error "--db-password requires a value"
                exit 1
            fi
            export DB_PASSWORD="$2"
            print_info "Database password updated"
            shift 2
            ;;
        --app-port)
            if [ -z "$2" ] || [[ "$2" == --* ]]; then
                print_error "--app-port requires a value"
                exit 1
            fi
            export APP_PORT="$2"
            print_info "Application port set to: $APP_PORT"
            shift 2
            ;;
        --phpmyadmin-port)
            if [ -z "$2" ] || [[ "$2" == --* ]]; then
                print_error "--phpmyadmin-port requires a value"
                exit 1
            fi
            export PHPMYADMIN_PORT="$2"
            print_info "phpMyAdmin port set to: $PHPMYADMIN_PORT"
            shift 2
            ;;
        --wave-repo)
            if [ -z "$2" ] || [[ "$2" == --* ]]; then
                print_error "--wave-repo requires a value"
                exit 1
            fi
            export WAVE_REPO="$2"
            print_info "Wave repository set to: $WAVE_REPO"
            shift 2
            ;;
        --wave-version)
            if [ -z "$2" ] || [[ "$2" == --* ]]; then
                print_error "--wave-version requires a value"
                exit 1
            fi
            export WAVE_VERSION="$2"
            print_info "Wave version set to: $WAVE_VERSION"
            shift 2
            ;;
        --rebuild)
            REBUILD=true
            shift
            ;;
        --fresh)
            FRESH=true
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Usage: ./setup.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --db-name NAME          Database name (default: wave)"
            echo "  --db-user USER          Database user (default: wave)"
            echo "  --db-password PASS      Database password (default: secret)"
            echo "  --app-port PORT         Application port (default: 8080)"
            echo "  --phpmyadmin-port PORT  phpMyAdmin port (default: 8081)"
            echo "  --wave-repo URL         Wave git repository (default: thedevdojo/wave)"
            echo "  --wave-version VERSION  Wave version tag (default: 3.1.2)"
            echo "  --rebuild               Force rebuild of Docker images"
            echo "  --fresh                 Fresh install (removes volumes)"
            exit 1
            ;;
    esac
done

# Update APP_URL based on APP_PORT
export APP_URL="http://localhost:${APP_PORT}"

# Handle fresh install
if [ "$FRESH" = true ]; then
    print_warning "Fresh install requested - removing existing containers and volumes..."
    docker compose down -v
    print_success "Cleaned up existing containers and volumes"
fi

# Build and start containers
print_info "Building and starting Docker containers..."
echo ""

if [ "$REBUILD" = true ]; then
    print_info "Forcing rebuild of Docker images..."
    docker compose up --build -d
else
    docker compose up -d
fi

echo ""
print_success "Docker containers are starting up..."

# Wait for application to be ready (check for FPM ready signal)
print_info "Waiting for application to be ready..."
MAX_WAIT=120  # Maximum wait time in seconds
ELAPSED=0
READY=false

while [ $ELAPSED -lt $MAX_WAIT ]; do
    if docker compose logs app 2>/dev/null | grep -q "fpm is running"; then
        READY=true
        break
    fi
    sleep 2
    ELAPSED=$((ELAPSED + 2))
    
    # Show progress every 10 seconds
    if [ $((ELAPSED % 10)) -eq 0 ]; then
        print_info "Still waiting... (${ELAPSED}s elapsed)"
    fi
done

if [ "$READY" = true ]; then
    print_success "Application is ready!"
else
    print_warning "Timeout waiting for application (waited ${MAX_WAIT}s)"
    print_info "Application may still be initializing. Check logs with: docker compose logs -f app"
fi

# Check if containers are running
if docker compose ps | grep -q "Up"; then
    print_success "Containers are running!"
else
    print_error "Some containers failed to start. Check logs with: docker compose logs"
    exit 1
fi

# Display access information
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "Wave Development Environment is Ready!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 Access Points:"
echo "   🌊 Wave Application:  http://localhost:${APP_PORT}"
echo "   🗄️  phpMyAdmin:        http://localhost:${PHPMYADMIN_PORT} (auto-login)"
echo "   📧 Mailpit:           http://localhost:${MAILPIT_WEB_PORT} (email testing)"
echo ""
echo "🔐 Database Credentials:"
echo "   Host:     mariadb (from container) or localhost:3306 (from host)"
echo "   Database: ${DB_DATABASE}"
echo "   Username: ${DB_USERNAME}"
echo "   Password: ${DB_PASSWORD}"
echo ""
echo "📝 Useful Commands:"
echo "   View logs:           docker compose logs -f"
echo "   Stop containers:     docker compose stop"
echo "   Start containers:    docker compose start"
echo "   Restart containers:  docker compose restart"
echo "   Enter app container: docker compose exec app bash"
echo "   Run artisan:         docker compose exec app php artisan [command]"
echo ""
echo "🎨 Custom Theme:"
echo "   Place your custom theme in: ./themes/custom/"
echo "   It will be automatically activated on container start"
echo ""
echo "🔌 Plugins:"
echo "   Place your plugins in: ./plugins/"
echo "   They will be available at: /var/www/html/custom/plugins/"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "Setup complete! Happy coding! 🚀"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
