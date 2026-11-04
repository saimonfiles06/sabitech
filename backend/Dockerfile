FROM php:8.4-apache-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libicu-dev libonig-dev libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring intl zip bcmath \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN a2enmod rewrite

COPY docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html