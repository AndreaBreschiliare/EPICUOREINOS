FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY backend/src ./src
COPY backend/knexfile.js ./
COPY backend/migrations ./migrations

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]
