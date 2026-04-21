# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
COPY packages/client/package*.json ./packages/client/
COPY tsconfig.base.json ./
# Note: --legacy-peer-deps is used because the React 18 + TypeScript + testing library stack
# has peer dependency conflicts that npm's strict resolution would otherwise reject.
# These are known, non-breaking mismatches and are safe to bypass.
RUN npm ci --legacy-peer-deps
COPY packages/client ./packages/client
RUN npm run build -w packages/client && test -d packages/client/dist && test -f packages/client/dist/index.html || (echo "Frontend build failed: dist/ or index.html not found" && exit 1)

# Stage 2: Build backend
FROM node:20-alpine AS backend-build
WORKDIR /app
COPY package*.json ./
COPY packages/server/package*.json ./packages/server/
COPY tsconfig.base.json ./
# Note: --legacy-peer-deps is used because the Express + TypeScript stack has minor
# peer dependency conflicts that are known and safe to bypass.
RUN npm ci --legacy-peer-deps
COPY packages/server ./packages/server
RUN npm cache clean --force && npm run build -w packages/server && test -d packages/server/dist && test -f packages/server/dist/index.js || (echo "Backend build failed: dist/ or index.js not found" && exit 1)

# Stage 3: Runtime
FROM node:20-alpine
WORKDIR /app

# Install runtime dependencies only (skip dev scripts like husky)
COPY package*.json ./
COPY packages/server/package*.json ./packages/server/
RUN npm ci --legacy-peer-deps --omit=dev --ignore-scripts

# Copy compiled backend from build stage
COPY --from=backend-build /app/packages/server/dist ./packages/server/dist

# Copy compiled frontend from build stage
COPY --from=frontend-build /app/packages/client/dist ./packages/client/dist

# Copy dictionary file (CRITICAL: API cannot function without this)
COPY packages/server/data ./packages/server/data
RUN test -f packages/server/data/words.txt || (echo "ERROR: Dictionary file packages/server/data/words.txt not found. Build cannot continue." && exit 1)

# Expose port (matches PORT environment variable default; if PORT is overridden, update this as well)
EXPOSE 3000

# Environment defaults (can be overridden at runtime with -e flag or docker-compose environment)
ENV NODE_ENV=production
ENV PORT=3000
ENV WORD_LIST_PATH=./packages/server/data/words.txt
# CORS_ORIGIN default is localhost (for development/testing only)
# IMPORTANT: Override at runtime for production: -e CORS_ORIGIN=https://yourdomain.com
ENV CORS_ORIGIN=http://localhost:3000

# Start server
CMD ["node", "packages/server/dist/index.js"]
