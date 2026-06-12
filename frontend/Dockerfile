# 1. Build Stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Serve Stage (using Nginx to serve the static files)
FROM nginx:alpine
# Copy the built files from the build stage into the Nginx folder
COPY --from=build /app/dist /usr/share/nginx/html
# Expose port 80 (the default for Nginx)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]