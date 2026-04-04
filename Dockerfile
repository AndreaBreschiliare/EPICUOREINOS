# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy project files from EPICUOREINOS directory
COPY EPICUOREINOS/backend/package*.json ./backend/
COPY EPICUOREINOS/frontend/package*.json ./frontend/

# Install dependencies
RUN cd backend && npm ci
RUN cd frontend && npm ci

# Copy source code
COPY EPICUOREINOS/backend ./backend
COPY EPICUOREINOS/frontend ./frontend
COPY EPICUOREINOS/migrations ./migrations 2>/dev/null || true

# Build frontend
RUN cd frontend && npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY EPICUOREINOS/backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy application code from builder
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/migrations ./migrations 2>/dev/null || true

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Database migration
ENV NODE_ENV=production
EXPOSE 5000

# Run migrations and start server
CMD ["sh", "-c", "cd backend && npm run migrate && npm start"]
