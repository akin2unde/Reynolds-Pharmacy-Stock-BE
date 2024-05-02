FROM node as builder

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:slim

ENV NODE_ENV production
USER node

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm ci --production

COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD [ "node", "dist/index.js" ]