# Usa una imagen base de Node.js
FROM node:20.16.0

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos package.json y package-lock.json (si está disponible)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia los archivos y carpetas del proyecto al directorio de trabajo del contenedor
COPY . .

# Compila el código TypeScript a JavaScript
RUN npm run build

# Expone el puerto en el que se ejecuta la aplicación
EXPOSE 8000

# Define la variable de entorno para el puerto
ENV PORT=8000

RUN npx prisma generate

# Comando para ejecutar la aplicación cuando se inicie el contenedor
CMD ["node", "dist/src/server.js"]
