# Stage 1: Build the Angular application
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install project dependencies
RUN npm ci --unsafe-perm

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN ng build --configuration production

# Stage 2: Serve the Angular application using Nginx
FROM nginx:alpine

# Copy the Angular build output to Nginx's html folder
COPY --from=build /app/dist/robot/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]