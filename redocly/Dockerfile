FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build documentation and bundle spec
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["pnpm", "start"]
