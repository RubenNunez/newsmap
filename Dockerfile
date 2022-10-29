FROM node:alpine AS build
WORKDIR /app
COPY ./src/newsmap-frontend /app/
RUN yarn
RUN yarn run build


FROM nginx:alpine
COPY --from=build /app/build/ /var/www
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx","-g","daemon off;"]