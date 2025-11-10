# debug frontend Dockerfile - temporary (prints useful info)
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files (package.json and package-lock.json if present)
COPY package*.json ./

# ensure we are in a build environment that installs devDependencies
ENV NODE_ENV=development
ENV NPM_CONFIG_LOGLEVEL=verbose

# Install exact deps, allowing legacy peer deps (prints verbose output)
RUN npm ci --legacy-peer-deps

# Print what got installed and some environment info for debugging
RUN echo "===== node version =====" && node -v \
    && echo "===== npm version =====" && npm -v \
    && echo "===== NODE_ENV =====" && node -e "console.log(process.env.NODE_ENV)" \
    && echo "===== ls node_modules (top) =====" && ls -la node_modules || true \
    && echo "===== ls node_modules/.bin =====" && ls -la node_modules/.bin || true \
    && echo "===== npx react-scripts (version or error) =====" && npx --no-install react-scripts --version || true \
    && echo "===== npm ls react-scripts (tree) =====" && npm ls react-scripts --all || true \
    && echo "===== package.json content =====" && cat package.json

# Stop here on purpose (we will not run the build yet)
