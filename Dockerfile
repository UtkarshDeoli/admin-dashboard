FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js project
RUN npm run build

# Use a lightweight runtime image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built application from the builder stage
COPY --from=builder /app .

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
