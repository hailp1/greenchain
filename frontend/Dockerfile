# Use Node.js LTS
FROM node:20-slim

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

ENV HOSTNAME "0.0.0.0"

# Start the app
CMD ["npm", "start"]
