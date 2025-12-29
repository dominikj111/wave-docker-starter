FROM php:8.2-fpm

# Build arguments with defaults
ARG WAVE_REPO=https://github.com/thedevdojo/wave.git
ARG WAVE_VERSION=3.1.2

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libexif-dev \
    libicu-dev \
    zip \
    unzip \
    default-mysql-client \
    nginx \
    supervisor \
    nodejs \
    npm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl

# Install Composer from official installer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Clone Wave to temp directory, then move files to /var/www/html
RUN git clone --branch ${WAVE_VERSION} --depth 1 ${WAVE_REPO} /tmp/wave \
    && mv /tmp/wave/* /tmp/wave/.[!.]* /var/www/html/ 2>/dev/null || true \
    && rm -rf /tmp/wave

# Set working directory
WORKDIR /var/www/html

# Fix git ownership warning (git was cloned as root)
RUN git config --global --add safe.directory /var/www/html

# Install composer dependencies
RUN composer install --no-dev --optimize-autoloader

# Install npm dependencies and build
RUN npm install && npm run build

WORKDIR /var/www/html/resources/plugins/component-catalog/ui

# Install plugins npm dependencies and build
RUN npm install && npm run build

WORKDIR /var/www/html

RUN php artisan vendor:publish --tag=component-catalog-assets --force

# Copy .env.example to .env (will be updated by entrypoint)
RUN cp .env.example .env

# Generate application key
RUN php artisan key:generate

# Fix ownership and permissions for all files
RUN chown -R www-data:www-data /var/www/html

# Set specific permissions for writable directories
RUN chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Expose port 80
EXPOSE 80
