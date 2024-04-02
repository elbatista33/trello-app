# Utiliser l'image Node.js alpine comme base
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /src

# Copier les fichiers package.json et package-lock.json dans le conteneur
COPY package.json package-lock.json ./

# Installer les dépendances du projet
RUN npm install

# Copier le reste des fichiers de l'application dans le conteneur
COPY . .

# Exposer le port 3000 pour accéder à l'application React
EXPOSE 5173

# Commande pour démarrer l'application React en mode développement
CMD ["npm", "run", "dev"]
