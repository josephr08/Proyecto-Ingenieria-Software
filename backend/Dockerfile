# ===== BACKEND =====
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm Install --legacy-peer-deps

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
