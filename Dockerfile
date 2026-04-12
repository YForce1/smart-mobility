FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install only express (no dev dependencies needed)
RUN npm install express --legacy-peer-deps

# Copy the pre-built app and server
COPY dist/ ./dist/
COPY server.js ./

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
