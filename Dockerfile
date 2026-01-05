# ---- Build Stage ----
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Accept build argument from CapRover
ARG VITE_API_URL

# Expose it as an environment variable for Vite
ENV VITE_API_URL=$VITE_API_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy source code
COPY . .

# (Optional) Debug — remove after confirming
RUN echo "VITE_API_URL=$VITE_API_URL"

# Build the app (Vite will read env vars here)
RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine

# Copy built app from build stage to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]