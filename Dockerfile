FROM php:7.2-fpm-alpine

RUN apk update && apk add build-base

RUN apk add postgresql postgresql-dev \
  && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
  && docker-php-ext-install pdo pdo_pgsql pgsql

RUN apk add zlib-dev git zip \
  && docker-php-ext-install zip

RUN curl -sS https://getcomposer.org/installer | php \
        && mv composer.phar /usr/local/bin/ \
        && ln -s /usr/local/bin/composer.phar /usr/local/bin/composer

# This is handled by docker-compose, which mounts the current directory at /app
# COPY . /app

WORKDIR /app

RUN composer install --prefer-dist --no-scripts --no-dev && rm -rf /root/.composer

ENV PATH="~/.composer/vendor/bin:./vendor/bin:${PATH}"
