FROM node:14.17.4-alpine as builder
WORKDIR /app
COPY package*.json .
RUN npm install 
COPY . .
RUN npm run build

FROM httpd:2.4 as production
COPY --from=builder /app/build /usr/local/apache2/htdocs/
EXPOSE 80

