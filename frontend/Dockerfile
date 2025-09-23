# Build stage
FROM node:lts-alpine as build

WORKDIR /app
COPY package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

COPY . .
RUN npm run build

# Production stage  
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Make nginx listen on port 8080
RUN echo 'server { \
    listen 8080; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]