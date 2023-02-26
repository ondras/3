FROM php:8.1-apache
WORKDIR /var/www/html

RUN apt update && apt install -y openscad && apt clean

COPY . .
RUN mkdir out && chmod o+w out

EXPOSE 80
VOLUME /var/www/html/out
