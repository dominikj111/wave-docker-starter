#!/bin/bash
set -e

echo "🚀 Wave Entrypoint: Starting initialization..."

# Update .env file with environment variables from docker-compose
if [ -f .env ]; then
    echo "📝 Updating .env file with docker-compose.yml environment variables..."
    
    # Update database configuration
    sed -i "s/DB_CONNECTION=.*/DB_CONNECTION=mysql/" .env
    sed -i "s/DB_HOST=.*/DB_HOST=${DB_HOST}/" .env
    sed -i "s/DB_PORT=.*/DB_PORT=${DB_PORT}/" .env
    sed -i "s/DB_DATABASE=.*/DB_DATABASE=${DB_DATABASE}/" .env
    sed -i "s/DB_USERNAME=.*/DB_USERNAME=${DB_USERNAME}/" .env
    sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=${DB_PASSWORD}/" .env
    
    # Update app configuration
    sed -i "s|APP_NAME=.*|APP_NAME=\"${APP_NAME}\"|" .env
    sed -i "s/APP_ENV=.*/APP_ENV=${APP_ENV}/" .env
    sed -i "s/APP_DEBUG=.*/APP_DEBUG=${APP_DEBUG}/" .env
    sed -i "s|APP_URL=.*|APP_URL=${APP_URL}|" .env
    
    # Update mail configuration for Mailpit
    sed -i "s/MAIL_MAILER=.*/MAIL_MAILER=smtp/" .env
    sed -i "s/MAIL_HOST=.*/MAIL_HOST=mailpit/" .env
    sed -i "s/MAIL_PORT=.*/MAIL_PORT=1025/" .env
    sed -i "s/MAIL_USERNAME=.*/MAIL_USERNAME=null/" .env
    sed -i "s/MAIL_PASSWORD=.*/MAIL_PASSWORD=null/" .env
    sed -i "s/MAIL_ENCRYPTION=.*/MAIL_ENCRYPTION=null/" .env
    
    echo "✅ .env file updated successfully"
fi

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until php artisan db:show 2>/dev/null; do
    echo "   Database not ready yet, retrying in 3 seconds..."
    sleep 3
done
echo "✅ Database connection established"

# Always run migrations (they are idempotent)
echo "🗄️  Running database migrations..."
php artisan migrate --force
echo "✅ Database migrations completed"

# Check if database needs seeding (check if users table has any records)
echo "🔍 Checking if database needs seeding..."
USER_COUNT=$(php artisan tinker --execute="echo \App\Models\User::count();" 2>/dev/null | tr -d '[:space:]' || echo "0")

if [[ "$USER_COUNT" =~ ^[0-9]+$ ]] && [[ "$USER_COUNT" -eq 0 ]]; then
    echo "🌱 Database is empty - running seeders..."
    php artisan db:seed --force
    echo "✅ Database seeded successfully"
else
    echo "ℹ️  Database already has $USER_COUNT user(s) - skipping seeding"
fi

# Create storage symlink (safe to run multiple times)
echo "🔗 Creating storage symlink..."
php artisan storage:link 2>/dev/null || echo "ℹ️  Storage link already exists"

# Ensure home page exists (required for Wave routing)
# echo "🏠 Checking for home page..."
# HOME_PAGE_EXISTS=$(php artisan tinker --execute="echo \Wave\Page::where('slug', '')->count();" 2>/dev/null | tr -d '[:space:]' || echo "0")

# if [[ "$HOME_PAGE_EXISTS" =~ ^[0-9]+$ ]] && [[ "$HOME_PAGE_EXISTS" -eq 0 ]]; then
#     echo "📄 Creating home page..."
#     php artisan tinker --execute="
#         \Wave\Page::create([
#             'slug' => '',
#             'title' => 'Home',
#             'body' => '<h1>Welcome to Wave</h1><p>Your SaaS application is ready!</p>',
#             'meta_description' => 'Welcome to your Wave application',
#             'status' => 'ACTIVE',
#             'author_id' => 1
#         ]);
#         echo 'Home page created';
#     " 2>/dev/null && echo "✅ Home page created successfully" || echo "⚠️  Could not create home page"
# else
#     echo "ℹ️  Home page already exists"
# fi

# # Activate custom theme if it exists
# if [ -d "/var/www/html/resources/themes/custom" ]; then
#     echo "🎨 Activating custom theme..."
#     php artisan tinker --execute="
#         DB::table('themes')->update(['active' => 0]);
#         DB::table('themes')->updateOrInsert(
#             ['folder' => 'custom'],
#             ['name' => 'Custom Theme', 'active' => 1, 'version' => 1.0]
#         );
#         echo 'Custom theme activated';
#     " 2>/dev/null || echo "⚠️  Could not activate custom theme (will use default)"
# fi

# Fix permissions (in case volumes are mounted)
echo "🔒 Setting proper permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Ensure www-data owns custom plugins and themes if they exist
if [ -d "/var/www/html/custom/plugins" ]; then
    chown -R www-data:www-data /var/www/html/custom/plugins
fi
if [ -d "/var/www/html/resources/themes" ]; then
    chown -R www-data:www-data /var/www/html/resources/themes
fi

# Clear caches
echo "🧹 Clearing application caches..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
php artisan event:clear

# Rebuild caches (config must be first, then routes)
php artisan config:cache
php artisan event:cache
php artisan route:cache

echo "✅ Wave initialization complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌊 Wave is ready!"
echo "   App URL:      ${APP_URL}"
echo "   Database:     ${DB_DATABASE}@${DB_HOST}"
echo "   phpMyAdmin:   http://localhost:8081 (auto-login)"
echo "   Mailpit:      http://localhost:8025 (email testing)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start supervisord to manage PHP-FPM and Nginx
echo "🚀 Starting supervisord..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
