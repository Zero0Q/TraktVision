# Use a smaller base image
FROM node:14-alpine

# Install necessary build tools
RUN apk add --no-cache python3 make g++ curl

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies and update stremio-addon-sdk to latest
RUN npm ci --only=production && npm install stremio-addon-sdk@latest

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD [ "node", "index.js" ]
