# Image Node.js officielle légère
FROM node:22-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers du projet
COPY . .

# Next.js écoute sur le port 3000 par défaut
EXPOSE 3000

# Commande pour lancer le serveur de développement Next.js
CMD ["npm", "run", "dev"]