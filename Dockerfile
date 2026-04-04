# Build stage - Build frontend and backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy entire project
COPY . .

# Build frontend
WORKDIR /app/EPICUOREINOS/frontend
RUN npm install
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built frontend from builder
COPY --from=builder /app/EPICUOREINOS/frontend/dist ./frontend/dist

# Install backend dependencies
COPY EPICUOREINOS/backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

# Copy backend source
COPY EPICUOREINOS/backend/ .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

ENV NODE_ENV=production
EXPOSE 5000

# Start server
CMD ["node", "src/app.js"]
