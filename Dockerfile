# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:16.8.0

# Create and change to the app directory.
WORKDIR /app

# Copy local code to the container image.
COPY . .

# Update npm version.
RUN npm install -g npm@8.5.5

# Install production dependencies.
RUN npm install 
RUN npm run build

RUN npm run db:migrate

EXPOSE 5001

CMD ["npm","run","start:pro"]
