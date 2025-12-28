# Wave SaaS Development Environment

Docker-based development environment for [Wave SaaS](https://github.com/thedevdojo/wave) - a Laravel SaaS starter kit. This setup protects Wave core inside containers while enabling plugin and theme development through bind-mounted directories.

## Overview

**What it does:**

- Clones Wave core during Docker build (v3.1.2 by default)
- Keeps Wave core pristine inside containers for clean upgrades
- Mounts only `plugins/` and `themes/` for development
- Provides complete stack: PHP 8.2, Nginx, MariaDB, phpMyAdmin, Mailpit

**Key principle:** Wave core is **never modified** - all customization happens in plugins and themes.

## Quick Start

```bash
git clone <your-repo-url>
cd wave_saas
./start.sh
```

Access points:

- **Application:** http://localhost:8080
- **phpMyAdmin:** http://localhost:8081 (auto-login)
- **Mailpit:** http://localhost:8025 (email testing)

## Project Structure

```
wave_saas/
├── docker/
│   ├── Dockerfile              # Clones Wave at build time
│   ├── entrypoint.sh           # Runtime initialization
│   ├── nginx/default.conf      # Web server config
│   ├── supervisor/supervisord.conf
│   ├── php/local.ini
│   └── mysql/
│       ├── my.cnf
│       └── data/               # Persistent storage (gitignored)
├── plugins/                    # Your custom plugins (bind-mounted)
├── themes/custom/              # Your custom theme (bind-mounted)
├── docker-compose.yml          # Services with environment defaults
├── start.sh                    # Setup script
└── README.md
```

**Note:** Wave core lives at `/var/www/html` inside the container and is **not** bind-mounted.

## Environment Control

All configuration via `docker-compose.yml` environment variables. No `.env` file needed in project root.

### Key Variables

| Variable           | Default  | Description       |
| ------------------ | -------- | ----------------- |
| `APP_PORT`         | `8080`   | Application port  |
| `DB_DATABASE`      | `wave`   | Database name     |
| `DB_USERNAME`      | `wave`   | Database user     |
| `DB_PASSWORD`      | `secret` | Database password |
| `PHPMYADMIN_PORT`  | `8081`   | phpMyAdmin port   |
| `MAILPIT_WEB_PORT` | `8025`   | Mailpit UI port   |
| `WAVE_VERSION`     | `3.1.2`  | Wave version tag  |

### Changing Configuration

**Via start script:**

```bash
./start.sh --db-name myapp --app-port 9000 --rebuild
```

**Via environment:**

```bash
export DB_DATABASE=myapp
export APP_PORT=9000
docker compose up --build -d
```

## Essential Commands

### Container Management

```bash
# Access app container shell
docker compose exec app /bin/bash

# View logs
docker compose logs -f app

# Restart services (re-runs entrypoint, clears caches)
docker compose restart app

# Stop containers
docker compose down

# Fresh start (removes all data including database)
docker compose down -v && rm -rf docker/mysql/data
```

### Laravel/Artisan Commands

```bash
# Run artisan commands
docker compose exec app php artisan migrate
docker compose exec app php artisan db:seed
docker compose exec app php artisan tinker
docker compose exec app php artisan cache:clear
```

### Composer & NPM

```bash
# Install PHP dependencies
docker compose exec app php composer install
docker compose exec app php composer require vendor/package

# Install and build frontend assets
docker compose exec app npm install
docker compose exec app npm run build
docker compose exec app npm run dev
```

### File Operations

```bash
# Copy files from container to host
docker cp wave_app:/var/www/html/storage/logs/laravel.log .
docker cp wave_app:/var/www/html/public/storage ./public/

# Copy files from host to container (rare, use with caution)
docker cp ./local-file.php wave_app:/var/www/html/storage/app/
```

### Database Operations

```bash
# Access MariaDB CLI
docker compose exec mariadb mysql -u wave -psecret wave

# Backup database
docker compose exec mariadb mysqldump -u wave -psecret wave > backup.sql

# Restore database
docker compose exec -T mariadb mysql -u wave -psecret wave < backup.sql
```

## Development Workflow

### Custom Theme Development

Create/edit files in `themes/custom/`:

```bash
mkdir -p themes/custom/components/app
# Edit themes/custom/components/app/sidebar.blade.php
```

Only override what you need - inherits from anchor theme. Changes reflect immediately (bind-mounted).

### Plugin Development

Create plugins in `plugins/`:

```bash
mkdir -p plugins/my-plugin
# Add your plugin files
```

Plugins are available at `/var/www/html/resources/plugins/` inside container.

## How It Works

**Build Time (Dockerfile):**

- Clones Wave from GitHub at specified version
- Installs Composer and npm dependencies
- Builds frontend assets
- Generates Laravel app key
- Sets base permissions

**Runtime (entrypoint.sh):**

- Updates Wave's `.env` with docker-compose environment variables
- Waits for MariaDB readiness
- Runs migrations and seeds (first time only)
- Fixes permissions for bind-mounted volumes
- Clears and rebuilds Laravel caches
- Starts supervisord (PHP-FPM + Nginx)

**On Restart:**

- Entrypoint re-runs, updating configuration
- Caches are cleared automatically
- No rebuild needed for config changes

## Troubleshooting

**Permission errors:**

```bash
docker compose exec app chown -R www-data:www-data /var/www/html/storage
docker compose restart app
```

**Database connection issues:**

```bash
docker compose logs mariadb
docker compose restart app
```

**Port conflicts:**

```bash
# Change ports in docker-compose.yml or via environment
export APP_PORT=9000
docker compose down && docker compose up -d
```

**Fresh install:**

```bash
./start.sh --fresh
```

## Contributing

Contributions are welcome! Work in `plugins/` or `themes/` directories only. Never modify Wave core files.

1. Create your plugin/theme
2. Test with `./start.sh`
3. Commit only your custom code
4. Submit pull request

## License

This project is not covered by any specific license. Wave itself has its own licensing terms.
