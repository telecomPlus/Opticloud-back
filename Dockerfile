# Base image optimized for Node.js
FROM node:18-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Use a smaller footprint for the final image
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./

# Expose port (Cloud Run uses 8080 by default)
EXPOSE 8080

# Start the application
CMD [ "npm", "start" ]
