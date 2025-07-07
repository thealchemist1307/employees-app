# /home/nishit/employees-app/apps/api-node/Dockerfile

FROM node:20-alpine
WORKDIR /usr/src/app

# Install production dependencies
COPY package-lock.json ./
COPY apps/api-node/package*.json ./
RUN npm ci --production

# Copy root TS config base for monorepo
COPY tsconfig.base.json /usr/tsconfig.base.json


# Copy source and local TS config
COPY apps/api-node/. ./

# Build transpiled output
RUN npm run build

# Expose application port
EXPOSE 4000

# Start the app
CMD ["node", "dist/index.js"]