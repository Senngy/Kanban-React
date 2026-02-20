#!/bin/sh

# Attente que la base de données soit prête (via netcat)
echo "Waiting for database to be ready..."
while ! nc -z database 5432; do
  sleep 1
done
echo "Database is ready!"

# Exécution des migrations et seeds
echo "Running migrations..."
npm run db:create
echo "Running seeds..."
npm run db:seed

# Lancement de l'application
echo "Starting application..."
npm run dev
