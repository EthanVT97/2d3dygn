FROM php:8.1-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    postgresql-client \
    ca-certificates \
    zip \
    unzip

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory contents
COPY composer.* ./
COPY . .

# Copy environment file
COPY .env.production .env

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions for storage
RUN chmod -R 775 storage bootstrap/cache
RUN chown -R www-data:www-data storage bootstrap/cache

# Generate key and optimize
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Change ownership of our applications
RUN chown -R www-data:www-data /var/www

# Expose port 8000
EXPOSE 8000

# Start command
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
