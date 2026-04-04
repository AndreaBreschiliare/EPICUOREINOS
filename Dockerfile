FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY EPICUOREINOS/backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY EPICUOREINOS/backend/src ./src
COPY EPICUOREINOS/backend/knexfile.js ./

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]
