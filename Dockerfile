# Stage 1: Build frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
COPY packages/client/package*.json ./packages/client/
COPY tsconfig.base.json ./
RUN npm ci --legacy-peer-deps
COPY packages/client ./packages/client
RUN npm run build -w packages/client

# Stage 2: Build backend
FROM node:22-alpine AS backend-build
WORKDIR /app
COPY package*.json ./
COPY packages/server/package*.json ./packages/server/
COPY tsconfig.base.json ./
RUN npm ci --legacy-peer-deps
COPY packages/server ./packages/server
RUN npm cache clean --force && npm run build -w packages/server

# Stage 3: Runtime
FROM node:22-alpine
WORKDIR /app

# Install runtime dependencies only (skip dev scripts like husky)
COPY package*.json ./
COPY packages/server/package*.json ./packages/server/
RUN npm ci --legacy-peer-deps --omit=dev --ignore-scripts

# Copy compiled backend from build stage
COPY --from=backend-build /app/packages/server/dist ./packages/server/dist

# Copy compiled frontend from build stage
COPY --from=frontend-build /app/packages/client/dist ./packages/client/dist

# Copy dictionary file
COPY packages/server/data ./packages/server/data

# Expose port
EXPOSE 3000

# Environment defaults (can be overridden)
ENV NODE_ENV=production
ENV PORT=3000
ENV WORD_LIST_PATH=./packages/server/data/words.txt
ENV CORS_ORIGIN=*

# Start server
CMD ["node", "packages/server/dist/index.js"]
