# Use Node.js LTS version
FROM node:18-alpine

LABEL maintainer="EL HADRI HASSAN hadarisas@gmail.com"
LABEL description="Elasticsearch demo server application with product search functionality"
LABEL version="1.0"

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3001

# Start the application
CMD ["npm", "start"] 