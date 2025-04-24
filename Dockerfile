# Use the official Node.js image as the base image
FROM node:23-alpine

# Set the working directory
WORKDIR /app

# Copy the cold-harbor-service build files
COPY cold-harbor-service/dist ./cold-harbor-service/dist

# Copy the cold-harbor-ui build folder
COPY cold-harbor-ui/build ./cold-harbor-ui/build

# Copy package.json and package-lock.json for cold-harbor-service
COPY cold-harbor-service/package*.json ./cold-harbor-service/

# Install dependencies for cold-harbor-service
RUN cd cold-harbor-service && npm install --only=production

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "cold-harbor-service/dist/main"]