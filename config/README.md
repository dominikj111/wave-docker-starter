# Wave Configuration Overrides

This document describes the Wave configs that are mounted from the host to customize Wave without modifying core files.

## Currently Mounted Configs

### 1. DevDojo Auth Config

**Path:** `./docker/config/devdojo/auth/` → `/var/www/html/config/devdojo/auth/`

**Files:**

- `appearance.php` - Auth page branding, colors, background images, logo
- `descriptions.php` - Auth page descriptions and help text
- `language.php` - Auth page text/translations
- `providers.php` - Social auth providers configuration
- `settings.php` - Auth behavior settings

**Why mount it:**

- Customize login/register page appearance
- Add custom background images
- Change colors, logos, and branding
- Configure social login providers
- Modify auth flow behavior

**Example customizations:**

```php
// appearance.php
'background' => [
    'color' => '#ffffff',
    'image' => '/assets/auth-background.png',
    'image_overlay_opacity' => '0.3',
],
```

### 2. DevDojo Billing Config

**Path:** `./docker/config/devdojo/billing/` → `/var/www/html/config/devdojo/billing/`

**Files:**

- `keys.php` - Payment provider API keys
- `language.php` - Billing page text/translations
- `style.php` - Billing page styling

**Why mount it:**

- Configure payment providers (Stripe, Paddle, etc.)
- Customize billing page appearance
- Modify billing text and translations

## Custom Public Assets

### Assets Directory

**Path:** `./assets/public/` → `/var/www/html/public/assets/`

**Purpose:**

- Serve custom static assets (images, fonts, etc.)
- Add auth background images
- Host custom logos and branding assets

**Example structure:**

```()
assets/public/
├── storage/
│   └── auth/
│       ├── background.png
│       ├── favicon.png
│       └── favicon-dark.png
├── fonts/
│   └── custom-font.woff2
└── images/
    └── logo.svg
```

**Usage in configs:**

```php
'image' => '/assets/storage/auth/background.png',
'favicon' => '/assets/storage/auth/favicon.png',
```

## Other Useful Wave Configs to Consider Mounting

### 3. Wave Main Config

**Path:** `/var/www/html/config/wave.php`

**Contains:**

- Feature flags
- Demo mode settings
- User profile settings
- Notification settings

**When to mount:**

- Enable/disable Wave features
- Customize user profile fields
- Configure notifications

### 4. Filament Config

**Path:** `/var/www/html/config/filament.php`

**Contains:**

- Admin panel settings
- Navigation configuration
- Theme settings
- Resource paths

**When to mount:**

- Customize admin panel appearance
- Configure admin navigation
- Change admin theme

### 5. Theme Config

**Path:** `/var/www/html/config/themes.php`

**Contains:**

- Active theme configuration
- Theme paths
- Theme fallback settings

**When to mount:**

- Configure theme system
- Set default theme
- Configure theme inheritance

## How to Mount Additional Configs

1. **Copy config from container:**

```bash
docker compose exec app cp -r /var/www/html/config/wave.php /tmp/
docker cp wave_app:/tmp/wave.php ./docker/config/
```

2. **Add mount to docker-compose.yml:**

```yaml
volumes:
  - ./docker/config/wave.php:/var/www/html/config/wave.php
```

3. **Restart container:**

```bash
docker compose restart app
docker compose exec app php artisan config:clear
```

## Best Practices

1. **Version Control:** All mounted configs are in `./docker/config/` and tracked in git
2. **Documentation:** Document any changes you make to configs
3. **Environment Variables:** Use `.env` for sensitive data, not config files
4. **Backup:** Keep original configs before modifying
5. **Testing:** Test config changes in development before production

## Current Mount Summary

```yaml
# docker-compose.yml
volumes:
  - ./plugins:/var/www/html/resources/plugins
  - ./themes/custom:/var/www/html/resources/themes/custom
  - ./docker/config/devdojo:/var/www/html/config/devdojo
  - ./assets/public:/var/www/html/public/assets
```

## Troubleshooting

**Config changes not applying:**

```bash
docker compose exec app php artisan config:clear
docker compose exec app php artisan cache:clear
```

**Mount not working:**

```bash
docker compose down
docker compose up -d
```

**Check mounted files:**

```bash
docker compose exec app ls -la /var/www/html/config/devdojo/
docker compose exec app cat /var/www/html/config/devdojo/auth/appearance.php
```
