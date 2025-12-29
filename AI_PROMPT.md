# Wave SaaS Development Environment Prompt

Use this prompt when working on the Wave SaaS Docker-based development environment.

---

## The Prompt

I'm working on a **Docker-based development environment for Wave SaaS** - a Laravel-based SaaS starter kit. The project provides a developer-friendly way to quickly start Wave development while protecting the Wave core for issue-free upgrades.

### Project Overview

**Wave SaaS Development Environment** is a complete Docker setup that:

- Hides Wave core in a container (cloned during build)
- Mounts only plugins and custom themes for development
- Protects Wave core from modifications
- Enables one-command setup via `./start.sh`
- Follows best practices for build-time vs runtime operations

### Core Philosophy

**Protection First:**

- Wave core is cloned and installed inside Docker during **build time**
- **Wave core must NOT be modified** - it stays pristine inside the container
- Developers work ONLY in `plugins/` and `themes/` directories
- COPY commands into internal Docker Wave structure are **STRICTLY FORBIDDEN** (only extremely rare edge cases)
- This ensures clean Wave upgrades without conflicts

**Developer Experience:**

- Single command setup: `./start.sh`
- No manual configuration needed (sensible defaults provided)
- All services pre-configured and ready to use

### Project Structure

```
wave_saas/
├── docker/
│   ├── Dockerfile              # Clones Wave, installs deps (BUILD TIME)
│   ├── entrypoint.sh           # Updates .env, runs migrations, seeds (RUNTIME)
│   ├── nginx/
│   │   └── default.conf        # Nginx web server configuration
│   ├── supervisor/
│   │   └── supervisord.conf    # Process manager (PHP-FPM + Nginx)
│   ├── php/
│   │   └── local.ini           # PHP configuration overrides
│   └── mysql/
│       ├── my.cnf              # MariaDB configuration
│       └── data/               # Database persistent storage (gitignored)
├── plugins/                    # YOUR CUSTOM PLUGINS (bind-mounted)
├── themes/
│   ├── custom/                 # YOUR CUSTOM THEME (bind-mounted)
│   └── README.md               # Theme development guide
├── docker-compose.yml          # Service definitions with environment defaults
├── start.sh                    # Main setup script (user entry point)
├── .gitignore                  # Excludes Wave core, DB data, etc.
└── README.md                   # Complete documentation
```

**Key Point:** Wave core lives at `/var/www/html` inside the container and is **NOT** bind-mounted to the host.

### Build Time vs Runtime Operations

**BUILD TIME (Dockerfile):**

- Clone Wave from GitHub at specified version
- Install Composer dependencies (`composer install`)
- Install npm dependencies and build assets (`npm install && npm run build`)
- Copy `.env.example` to `.env` (initial setup)
- Generate Laravel application key
- Set base permissions for storage/cache directories

**RUNTIME (entrypoint.sh):**

- Update Wave's `.env` with docker-compose environment variables
- Wait for MariaDB to be ready (health check)
- Run database migrations (`php artisan migrate --force`)
- Seed database if empty (check user count first)
- Create storage symlink
- Fix permissions for bind-mounted volumes (plugins/themes)
- Clear and rebuild Laravel caches (config, route, event, view)
- Start supervisord (manages PHP-FPM + Nginx)

### Services Architecture

**App Container (wave_app):**

- PHP 8.2-FPM + Nginx + Node.js + Supervisor
- Wave cloned at build time
- Bind mounts: `plugins/`, `themes/custom/`, config files
- Port: 8080 (configurable via `APP_PORT`)

**MariaDB Container (wave_mariadb):**

- MariaDB 11 database server
- Persistent volume for data
- Health check enabled
- Port: 3306 (configurable via `DB_PORT`)

**phpMyAdmin Container (wave_phpmyadmin):**

- Database management interface
- Auto-login configured (no credentials needed)
- Port: 8081 (configurable via `PHPMYADMIN_PORT`)

**Mailpit Container (wave_mailpit):**

- Email testing tool (catches all outgoing emails)
- Web UI port: 8025 (configurable via `MAILPIT_WEB_PORT`)
- SMTP port: 1025 (configurable via `MAILPIT_SMTP_PORT`)

### Environment Configuration

All configuration via **docker-compose.yml environment variables** with sensible defaults:

| Variable            | Default                                  | Description                    |
| ------------------- | ---------------------------------------- | ------------------------------ |
| `APP_NAME`          | `Wave`                                   | Application name               |
| `APP_ENV`           | `local`                                  | Environment (local/production) |
| `APP_DEBUG`         | `true`                                   | Debug mode                     |
| `APP_PORT`          | `8080`                                   | Application port               |
| `DB_DATABASE`       | `wave`                                   | Database name                  |
| `DB_USERNAME`       | `wave`                                   | Database user                  |
| `DB_PASSWORD`       | `secret`                                 | Database password              |
| `DB_ROOT_PASSWORD`  | `root`                                   | MariaDB root password          |
| `PHPMYADMIN_PORT`   | `8081`                                   | phpMyAdmin port                |
| `MAILPIT_WEB_PORT`  | `8025`                                   | Mailpit web UI port            |
| `MAILPIT_SMTP_PORT` | `1025`                                   | Mailpit SMTP port              |
| `WAVE_REPO`         | `https://github.com/thedevdojo/wave.git` | Wave git repository            |
| `WAVE_VERSION`      | `3.1.2`                                  | Wave version tag               |

**No `.env` file needed in project root!** All config via docker-compose.yml.

### Development Workflow

**Initial Setup:**

```bash
git clone <your-repo-url>
cd wave_saas
./start.sh
```

**Custom Theme Development:**

- Create files in `themes/custom/`
- Only override what you need (inherits from anchor theme)
- Changes reflect immediately (bind-mounted)

**Plugin Development:**

- Create plugin directories in `plugins/`
- Available at `/var/www/html/resources/plugins/` in container
- Changes reflect immediately (bind-mounted)

**Common Commands:**

```bash
# Access app container shell
docker compose exec app /bin/bash

# View logs
docker compose logs -f app

# Run artisan commands
docker compose exec app php artisan migrate
docker compose exec app php artisan cache:clear

# Restart services (re-runs entrypoint, clears caches)
docker compose restart app

# Fresh start (removes all data including database)
docker compose down -v && rm -rf docker/mysql/data

# Composer and npm
docker compose exec app php composer install
docker compose exec app npm install
docker compose exec app npm run build

# Copy files from container
docker cp wave_app:/var/www/html/storage/logs/laravel.log .
```

### Critical Rules for AI Assistance

**ALWAYS:**

1. **Read README.md first** when getting familiar with the project
2. **Leave Wave core untouched** - no modifications to Wave core files whatsoever
3. Use build-time operations for: cloning, dependency installation, asset building
4. Use runtime operations for: .env updates, migrations, seeding, cache clearing
5. Respect the bind-mount strategy (plugins/themes only)
6. Follow Laravel and Wave best practices
7. Test changes with `./start.sh --rebuild` when Dockerfile changes
8. Use commands from README.md for container and application management

**NEVER:**

1. **Modify Wave core files** - Wave core is off-limits (only extremely rare edge cases)
2. Suggest COPY commands into Wave core structure
3. Bind-mount the entire Wave directory to host
4. Run migrations or seeders during build time
5. Hardcode credentials or configuration
6. Skip the entrypoint script's environment variable updates
7. Work outside `plugins/` and `themes/` directories

### Best Practices

**Dockerfile Changes:**

- Keep build args for Wave repo and version
- Install system dependencies before Wave clone
- Run composer/npm during build (not runtime)
- Set proper permissions at end of build

**Entrypoint Script:**

- Always update .env from environment variables first
- Wait for database health check before migrations
- Make operations idempotent (safe to run multiple times)
- Clear caches after configuration changes
- Fix permissions for bind-mounted volumes

**Development:**

- Work in `plugins/` for custom functionality
- Work in `themes/custom/` for UI customization
- Use Laravel conventions and Wave patterns
- Test email functionality with Mailpit
- Use phpMyAdmin for database inspection

### How to Help

When assisting with this project:

1. **Always read README.md** to understand current state
2. **Respect the architecture** - don't suggest breaking the protection model
3. **Distinguish build vs runtime** - operations must happen at the right time
4. **Follow Laravel/Wave conventions** - idiomatic code only
5. **Test suggestions** - ensure they work with the Docker setup
6. **Document changes** - update README.md when adding features
7. **Maintain simplicity** - one-command setup must remain simple

### Troubleshooting Context

**Permission Issues:**

- Entrypoint fixes permissions automatically
- www-data must own storage/cache directories
- Bind-mounted volumes need proper ownership

**Database Connection:**

- MariaDB health check ensures readiness
- Entrypoint waits for database before migrations
- Check logs with `docker compose logs mariadb`

**Cache Issues:**

- Entrypoint clears and rebuilds caches
- Run manually: `docker compose exec app php artisan cache:clear`

**Port Conflicts:**

- Change ports via environment variables
- Restart with `docker compose down && docker compose up -d`

### Wave Plugin Development

**Creating Plugins:**

```bash
# Generate plugin skeleton
docker compose exec app php artisan plugin:create plugin-name

# Plugin structure:
plugins/plugin-name/
├── PluginNamePlugin.php    # Main plugin class (StudlyCase + Plugin.php)
├── version.json
├── plugin.jpg
├── resources/views/
├── routes/web.php
└── src/Components/
```

**Plugin Naming Convention:**

- Folder name: `plugin-name` (lowercase with hyphens)
- Class name: `PluginNamePlugin` (StudlyCase + "Plugin" suffix)
- Namespace: `Wave\Plugins\PluginName\PluginNamePlugin`

**Activating Plugins:**

- Add folder name to `plugins/installed.json`: `["plugin-name"]`
- Or activate via admin panel at `/admin/plugins`
- Restart container to load: `docker compose restart app`

**Plugin Class Structure:**

```php
class PluginNamePlugin extends Plugin
{
    protected $name = 'PluginName';
    protected $description = 'Plugin description';

    public function register(): void
    {
        // Matches parent signature - typically empty
    }

    public function boot(): void
    {
        // Register views, routes, components
        // Add service provider logic here
    }

    public function getPostActivationCommands(): array
    {
        return ['view:clear', 'config:clear'];
    }

    public function getPluginInfo(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'version' => $this->getPluginVersion()
        ];
    }
}
```

**Important Notes:**

- Plugins extend `Wave\Plugins\Plugin` (which extends `ServiceProvider`)
- `register()` and `boot()` must match parent signatures with `: void` return type
- Plugins are loaded from `resources/plugins/` directory
- Plugin files are bind-mounted, changes reflect immediately
- Use `Log::info()` for debugging plugin behavior

### Custom Additions

- Whenever you have questions to confirm, stop and wait until I answer; do not presume.
- Always verify the project structure by reading README.md before making suggestions.
- **Wave core is untouchable** - no modifications whatsoever. This is critical for upgrade safety and the entire architecture depends on it.
- Do not make markdown explanation of code changes and do not note into markdown the chat interaction.

---

_Copy everything above the line when starting a Wave SaaS development conversation._
