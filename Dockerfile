FROM node:18

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./

RUN npm ci

# Install mongodb client for seeding
RUN npm install mongodb --save
# Copy the rest of the application
COPY . .

EXPOSE 5678

CMD ["npm", "run", "start"]