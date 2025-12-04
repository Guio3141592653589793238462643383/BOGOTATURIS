FROM node:20

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código
COPY . .

# Exponer puerto Vite
EXPOSE 5173

# Iniciar Vite con host para Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]