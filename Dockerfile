# Use the official Node.js image as a base
FROM node:21

# Set the working directory
WORKDIR /var/www/html

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the app
CMD ["node", "app.js"]