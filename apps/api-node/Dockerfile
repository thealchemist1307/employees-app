##########################
#  Node API production   #
##########################

FROM node:20-alpine

# 1. Create app directory
WORKDIR /usr/src/app

# 2. Install production dependencies using the root lockfile
COPY package*.json ./
RUN npm ci --production

# 3. Copy only the backend source
COPY . .

# 4. Compile TypeScript / Vite output
RUN npm run build

# 5. Expose the internal port (matches PORT=4000 in compose)
EXPOSE 4000

# 6. Start the server
CMD ["node", "dist/index.js"] 