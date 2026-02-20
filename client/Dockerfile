# Étape 1 : Build
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Définition des arguments de build pour Vite
ARG VITE_API_URL

# Création forcée du fichier .env pour que Vite le capture au build
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env

RUN echo "Building with VITE_API_URL=${VITE_API_URL}"

RUN npm run build

# Étape 2 : Production (Nginx)
FROM nginx:alpine

# Copie de la configuration Nginx personnalisée pour le routage SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie du build de l'étape précédente vers le répertoire Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposition du port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
