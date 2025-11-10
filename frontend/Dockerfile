# Stage 1: Build the React app
FROM node:22-alpine3.21 AS build

# Set working directory
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install exact dependencies (use package-lock.json)
RUN npm inst`all --legacy-peer-deps

# Copy project files
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Copy compiled build to Nginx public directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

