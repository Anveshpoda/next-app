# Build the Next.js app

FROM node:20-slim AS builder
#RUN npm install -g npm@10.8.2

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-slim

ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "start"]






# Stage 2: Serve with Nginx
# FROM nginx:alpine

# COPY --from=mybuilder /nextapp/.next /usr/share/nginx/html/.next
# COPY --from=mybuilder /nextapp/public /usr/share/nginx/html/public

# # Copy the custom Nginx configuration file
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expose port 80
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]
