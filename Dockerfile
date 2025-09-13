# Multi-stage Dockerfile for building and serving a Vite React (TypeScript) app

# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build the app
COPY . .
RUN npm run build

# ---- Runtime Stage ----
# Use a lightweight Node image and serve the static build via `serve` with SPA fallback
FROM node:20-alpine AS runner
WORKDIR /app

# Install a static file server that supports SPA fallback
RUN npm i -g serve@14.2.3

# Copy build artifacts
COPY --from=builder /app/dist ./dist

# Expose port and run the server
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]