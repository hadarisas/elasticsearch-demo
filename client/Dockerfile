# Build stage
FROM node:18-alpine AS build-stage

# Add maintainer information
LABEL maintainer="EL HADRI HASSAN hadarisas@gmail.com"
LABEL description="Elasticsearch demo client application with Vue 3"
LABEL version="1.0"

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine
LABEL maintainer="EL HADRI HASSAN hadarisas@gmail.com"

COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
