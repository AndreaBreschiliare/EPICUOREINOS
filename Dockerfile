# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy everything first
COPY . .

# Install dependencies for backend
WORKDIR /app/EPICUOREINOS/backend
RUN npm ci --only=production

# Install dependencies for frontend
WORKDIR /app/EPICUOREINOS/frontend
RUN npm ci

# Build frontend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/EPICUOREINOS/backend ./backend
COPY --from=builder /app/EPICUOREINOS/frontend/dist ./frontend/dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

ENV NODE_ENV=production
EXPOSE 5000

# Start server
WORKDIR /app/backend
CMD ["node", "src/app.js"]
