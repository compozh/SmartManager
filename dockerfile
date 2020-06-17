FROM node:14.4.0-stretch AS build
# создание директории приложения
WORKDIR /app
# установка зависимостей
# символ астериск ("*") используется для того чтобы по возможности 
# скопировать оба файла: package.json и package-lock.json
COPY package*.json ./
COPY .npmrc .
RUN npm install
# копируем исходный код
COPY ./ .
# RUN npm run build; exit 0
ENV VUE_APP_DOCKERMODE 1
RUN npm run build 
FROM nginx:stable-alpine as final
COPY --from=build /app/dist /app
#RUN rm /etc/nginx/conf.d/default.conf; exit 0
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

