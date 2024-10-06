# Use a more recent Node.js version
FROM node:16-alpine

# Install necessary build tools and libraries
RUN apk add --no-cache python3 make g++ curl git

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD [ "node", "index.js" ]
