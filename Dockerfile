# Usa una imagen oficial de Node.js, ligera (Alpine)
FROM node:22-alpine

# Instala pnpm globalmente
RUN npm install -g pnpm@11.1.0

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de configuración de dependencias
COPY package.json pnpm-lock.yaml ./

# Instala las dependencias (el --frozen-lockfile asegura instalaciones predecibles)
RUN pnpm install --frozen-lockfile

# Copia todo el código fuente del backend al contenedor
COPY . .

# Expone el puerto 3000 (el que usará tu aplicación por defecto)
EXPOSE 3000

# Inicia la aplicación usando el script de start de tu package.json
CMD ["pnpm", "start"]
