# Use the official Node.js image as the base image
FROM node:6

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which your Node.js app listens (assuming it listens on port 3000)
EXPOSE 3000

# Start your Node.js app
CMD ["node", "server.js"]
