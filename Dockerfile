# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Install path module globally
RUN npm install -g path

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build the app
RUN npm run build

# Serve stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=build /app/dist /usr/share/nginx/html

# Add our nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
