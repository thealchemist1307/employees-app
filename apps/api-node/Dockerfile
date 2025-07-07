##########################
#  Node API production   #
##########################

FROM node:20-alpine AS base

# 1. Create app directory
WORKDIR /usr/src/app

# 2. Install production deps
COPY package*.json ./
RUN npm ci --production

# 3. Copy source
COPY . .

# 4. Expose the internal port (matches PORT=4000 in compose)
EXPOSE 4000

# 5. Start the server
CMD ["node", "dist/index.js"] 