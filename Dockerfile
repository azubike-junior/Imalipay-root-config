# Use a Node 16 base image
FROM node:latest as builder
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN yarn install
# Build the app
RUN yarn run build:webpack
RUN ls 

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as development

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
#RUN rm -rf ./*
# Copy built assets from `builder` image
COPY --from=builder /app/dist /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
# 
