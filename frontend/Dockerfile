##############################
# Stage 1: Build React app
##############################
FROM node:18-alpine AS build

WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Install dependencies
ENV NODE_ENV=development
RUN npm install --legacy-peer-deps

# Force the correct AJV + ajv-keywords versions (fix for react-scripts builds)
RUN npm install ajv@6.12.6 ajv-keywords@3.5.2 --save-exact --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Build the React app
RUN npm run build

##############################
# Stage 2: Serve with Nginx
##############################
FROM nginx:1.25-alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled React app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# React Router friendly nginx config
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
  listen 80;
  server_name localhost;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files \$uri /index.html;
  }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
