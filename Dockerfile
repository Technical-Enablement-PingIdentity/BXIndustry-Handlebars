FROM node:lts-slim

## Install code-server dependencies and updates
RUN apt-get update && apt-get install -y curl libatk-bridge2.0-0 libgtk-3-0 libx11-xcb1 libasound2 libnss3 libxss1 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxshmfence1 xdg-utils libu2f-udev libvulkan1

# Install code-server
RUN curl -fsSL https://code-server.dev/install.sh | sh

# Create working directory
WORKDIR /app

# Copy app files
COPY . /app

# Install app dependencies
RUN npm install

# Create code-server config directory
RUN mkdir -p /root/.config/code-server

# Copy code-server config
# COPY .config/code-server/config.yaml /root/.config/code-server/config.yaml

# Copy self signed development certificates so it can run on HTTPS
COPY ./resources/dev-cert /root/certs

# Expose ports
EXPOSE 3000 8080

# Start project and code-server with HTTPS
CMD ["sh", "-c", "cd /app && npm run start & code-server --host 0.0.0.0 --port 8080 --auth none --cert /root/certs/server.crt --cert-key /root/certs/server.key /app"]