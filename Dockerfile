# =============================================================
# Stage 1: Build Frontend and Server
# =============================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install all dependencies (including devDependencies required for build)
RUN npm ci

# Copy application source files
COPY . .

# Build the Vite SPA and compile server.ts via esbuild
RUN npm run build

# =============================================================
# Stage 2: Production Runtime Image (Optimized for Google Cloud Run)
# =============================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Set container environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Copy package manifests and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built frontend assets and bundled server from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src ./src

# Google Cloud Run expects the container to listen on the PORT environment variable (default 8080)
EXPOSE 8080

# Run container as non-root user for security
USER node

# Start the Node.js/Express server (uses npm start -> node server.ts)
CMD ["npm", "start"]
