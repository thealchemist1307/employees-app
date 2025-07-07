##########################
#  Node API production   #
##########################

FROM node:20-alpine

# 1. Create app directory
WORKDIR /usr/src/app

# 2. Install production dependencies using the root lockfile
COPY package-lock.json ./
COPY apps/api-node/package*.json ./
RUN npm ci --production

# 3. Copy only the backend source
COPY apps/api-node/ .

# 4. Expose internal port (matches PORT env var)
EXPOSE 4000

# 5. Start the server
CMD ["node", "dist/index.js"] 