# build stage
FROM node:latest as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# final stage
FROM nginx:alpine as final
COPY --from=build /app/dist/frontend /usr/share/nginx/html
ENV CATALOG_API_URL="http://localhost:5050"
ENV CART_API_URL="http://localhost:5075"
ENV CHECKOUT_API_URL="http://localhost:5015"
WORKDIR /usr/share/nginx/html/assets/config/
CMD ["/bin/sh",  "-c",  "envsubst < app.config.template.json > app.config.json && rm app.config.template.json && exec nginx -g 'daemon off;'"]