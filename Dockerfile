FROM node:lts-slim

# Create working directory
WORKDIR /app

# Copy app files
COPY . /app

# Install only production packages without updating dependencies. Ignore 3rd-party scripts.
RUN npm config set update-notifier false && npm install --omit=dev --ignore-scripts

# Expose ports
EXPOSE 3000

# Start project and code-server with HTTPS
CMD ["node", "server.js"]