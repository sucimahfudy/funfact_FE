# Use a base image
FROM node:18 

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the desired port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
