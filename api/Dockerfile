# Utilisation d'une image de base Node.js légère
FROM node:22-alpine

# Création du répertoire de travail
WORKDIR /usr/src/app

# Copie des fichiers de configuration des dépendances
COPY package*.json ./

# Installation des dépendances (Production uniquement pour optimiser la taille)
RUN npm install

# Copie du reste du code source
COPY . .

# Copie du script d'entrée
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Exposition du port utilisé par l'API
EXPOSE 3000

# Utilisation du script d'entrée
ENTRYPOINT ["docker-entrypoint.sh"]
